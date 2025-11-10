const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret, expiresIn, refreshSecret, refreshExpiresIn } = require('../config/jwt');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

// Generar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

// Generar refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, refreshSecret, { expiresIn: refreshExpiresIn });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'El usuario ya existe', 400);
    }

    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'user'
    });

    // Generar token
    const token = generateToken(user._id);

    successResponse(res, {
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    }, 'Usuario registrado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { email, password } = req.body;

    // Verificar usuario y contraseña
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    if (user.estado !== 'active') {
      return errorResponse(res, 'Usuario inactivo', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    // Generar tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    successResponse(res, {
      token,
      refreshToken,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    }, 'Inicio de sesión exitoso');
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    successResponse(res, {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      estado: user.estado
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { nombre, email } = req.body;
    const fieldsToUpdate = {};

    if (nombre) fieldsToUpdate.nombre = nombre;
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return errorResponse(res, 'El email ya está en uso', 400);
      }
      fieldsToUpdate.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    successResponse(res, {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }, 'Perfil actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token requerido', 400);
    }

    const decoded = jwt.verify(refreshToken, refreshSecret);
    const user = await User.findById(decoded.id);

    if (!user || user.estado !== 'active') {
      return errorResponse(res, 'Usuario no válido', 401);
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    successResponse(res, {
      token: newToken,
      refreshToken: newRefreshToken
    }, 'Token renovado exitosamente');
  } catch (error) {
    return errorResponse(res, 'Refresh token inválido', 401);
  }
};

// @desc    Cerrar sesión
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // En una implementación más completa, podrías invalidar el token en una blacklist
    successResponse(res, null, 'Sesión cerrada exitosamente');
  } catch (error) {
    next(error);
  }
};

