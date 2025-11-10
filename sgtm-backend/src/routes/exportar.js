const express = require('express');
const router = require('express').Router();
const exportarController = require('../controllers/exportarController');
const { protect } = require('../middleware/auth');

router.get('/tipos', protect, exportarController.getTipos);
router.post('/generar', protect, exportarController.generar);
router.post('/multiple', protect, exportarController.generarMultiple);
router.post('/programar', protect, exportarController.programar);
router.get('/historial', protect, exportarController.getHistorial);
router.get('/descargar/:id', protect, exportarController.descargar);
router.get('/estado/:id', protect, exportarController.getEstado);
router.delete('/:id', protect, exportarController.eliminar);

module.exports = router;

