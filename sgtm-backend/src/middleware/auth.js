const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/jwt');

// Middleware para verificar token JWT
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (req.user.estado !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para verificar rol de administrador
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `El usuario con rol '${req.user.rol}' no tiene acceso a esta ruta`
      });
    }
    next();
  };
};

