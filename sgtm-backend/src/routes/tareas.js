const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const auth = require('../middleware/auth');

// Create
router.post(
  '/',
  [
    auth,
    body('titulo').notEmpty().withMessage('titulo requerido'),
    body('fecha')
      .matches(/^\d{2}\/\d{2}\/\d{4}$/)
      .withMessage('fecha inválida'),
  ],
  tareasController.create,
);

// List
router.get('/', auth, tareasController.list);

// Get
router.get('/:id', auth, tareasController.get);

// Update (put)
router.put('/:id', auth, tareasController.update);

// Patch
router.patch('/:id', auth, tareasController.patch);

// Delete
router.delete('/:id', auth, tareasController.remove);

// Estadísticas
router.get('/estadisticas', auth, tareasController.stats);

module.exports = router;
