const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

function generateAccessToken(user) {
  const payload = { id: user._id, rol: user.rol };
  return jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
}

function generateRefreshToken(user) {
  const payload = { id: user._id };
  return jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.error(
        res,
        'Errores de validación',
        400,
        errors.array(),
      );
    const { nombre, email, password, rol } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return apiResponse.error(res, 'Email ya registrado', 400);
    const user = new User({ nombre, email, password, rol });
    await user.save();
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens.push(refreshToken);
    await user.save();
    return apiResponse.success(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      },
      'Usuario registrado',
      201,
    );
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.error(
        res,
        'Errores de validación',
        400,
        errors.array(),
      );
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return apiResponse.error(res, 'Credenciales inválidas', 401);
    const match = await user.comparePassword(password);
    if (!match) return apiResponse.error(res, 'Credenciales inválidas', 401);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens.push(refreshToken);
    await user.save();
    return apiResponse.success(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      },
      'Inicio de sesión OK',
    );
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      '-password -refreshTokens',
    );
    return apiResponse.success(res, user);
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return apiResponse.unauthorized(res, 'refreshToken requerido');
    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET || 'change_this_secret',
      );
    } catch (e) {
      return apiResponse.unauthorized(res, 'refreshToken inválido');
    }
    const user = await User.findById(payload.id);
    if (!user) return apiResponse.unauthorized(res, 'Usuario no encontrado');
    if (!user.refreshTokens.includes(refreshToken))
      return apiResponse.unauthorized(res, 'refreshToken no válido');
    const accessToken = generateAccessToken(user);
    return apiResponse.success(res, { accessToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return apiResponse.error(res, 'refreshToken requerido', 400);
    const payload = jwt.decode(refreshToken);
    if (!payload) return apiResponse.error(res, 'refreshToken inválido', 400);
    const user = await User.findById(payload.id);
    if (!user) return apiResponse.error(res, 'Usuario no encontrado', 400);
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
    return apiResponse.success(res, {}, 'Sesión cerrada');
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = (({ nombre, email }) => ({ nombre, email }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select('-password -refreshTokens');
    return apiResponse.success(res, user, 'Perfil actualizado');
  } catch (err) {
    next(err);
  }
};
