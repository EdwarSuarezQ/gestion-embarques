const express = require('express');
const router = require('express').Router();
const embarcacionesController = require('../controllers/embarcacionesController');
const { validateEmbarcacion, validatePagination } = require('../utils/validators');

router.post('/', validateEmbarcacion, embarcacionesController.createEmbarcacion);
router.get('/', validatePagination, embarcacionesController.getEmbarcaciones);
router.get('/estadisticas', embarcacionesController.getEstadisticas);
router.get('/:id', embarcacionesController.getEmbarcacion);
router.put('/:id', validateEmbarcacion, embarcacionesController.updateEmbarcacion);
router.patch('/:id', embarcacionesController.patchEmbarcacion);
router.delete('/:id', embarcacionesController.deleteEmbarcacion);

module.exports = router;

