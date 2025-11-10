const express = require('express');
const router = require('express').Router();
const embarquesController = require('../controllers/embarquesController');
const { protect } = require('../middleware/auth');
const { validateEmbarque, validatePagination } = require('../utils/validators');

router.post('/', protect, validateEmbarque, embarquesController.createEmbarque);
router.get('/', protect, validatePagination, embarquesController.getEmbarques);
router.get('/estadisticas', protect, embarquesController.getEstadisticas);
router.get('/estado/:estado', protect, embarquesController.getEmbarquesByEstado);
router.get('/tipo/:tipo', protect, embarquesController.getEmbarquesByTipo);
router.get('/buque/:nombre', protect, embarquesController.getEmbarquesByBuque);
router.get('/activos', protect, embarquesController.getEmbarquesActivos);
router.get('/:id', protect, embarquesController.getEmbarque);
router.put('/:id', protect, validateEmbarque, embarquesController.updateEmbarque);
router.patch('/:id', protect, embarquesController.patchEmbarque);
router.put('/:id/estado', protect, embarquesController.updateEstado);
router.delete('/:id', protect, embarquesController.deleteEmbarque);

module.exports = router;

