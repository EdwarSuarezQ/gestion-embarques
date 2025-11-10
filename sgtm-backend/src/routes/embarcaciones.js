const express = require('express');
const router = require('express').Router();
const embarcacionesController = require('../controllers/embarcacionesController');
const { protect } = require('../middleware/auth');
const { validateEmbarcacion, validatePagination } = require('../utils/validators');

router.post('/', protect, validateEmbarcacion, embarcacionesController.createEmbarcacion);
router.get('/', protect, validatePagination, embarcacionesController.getEmbarcaciones);
router.get('/estadisticas', protect, embarcacionesController.getEstadisticas);
router.get('/:id', protect, embarcacionesController.getEmbarcacion);
router.put('/:id', protect, validateEmbarcacion, embarcacionesController.updateEmbarcacion);
router.patch('/:id', protect, embarcacionesController.patchEmbarcacion);
router.delete('/:id', protect, embarcacionesController.deleteEmbarcacion);

module.exports = router;

