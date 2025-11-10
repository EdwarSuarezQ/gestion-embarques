const express = require('express');
const router = require('express').Router();
const embarquesController = require('../controllers/embarquesController');
const { validateEmbarque, validatePagination } = require('../utils/validators');

router.post('/', validateEmbarque, embarquesController.createEmbarque);
router.get('/', validatePagination, embarquesController.getEmbarques);
router.get('/estadisticas', embarquesController.getEstadisticas);
router.get('/estado/:estado', embarquesController.getEmbarquesByEstado);
router.get('/tipo/:tipo', embarquesController.getEmbarquesByTipo);
router.get('/buque/:nombre', embarquesController.getEmbarquesByBuque);
router.get('/activos', embarquesController.getEmbarquesActivos);
router.get('/:id', embarquesController.getEmbarque);
router.put('/:id', validateEmbarque, embarquesController.updateEmbarque);
router.patch('/:id', embarquesController.patchEmbarque);
router.put('/:id/estado', embarquesController.updateEstado);
router.delete('/:id', embarquesController.deleteEmbarque);

module.exports = router;

