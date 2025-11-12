const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post(
  '/register',
  [
    body('nombre').notEmpty().withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password mínimo 6 caracteres'),
  ],
  authController.register,
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Password requerido'),
  ],
  authController.login,
);

// Me
router.get('/me', auth, authController.me);

// Update profile
router.put('/profile', auth, authController.updateProfile);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
