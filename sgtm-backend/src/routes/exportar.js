const express = require('express');
const router = require('express').Router();
const exportarController = require('../controllers/exportarController');

router.get('/tipos', exportarController.getTipos);
router.post('/generar', exportarController.generar);
router.post('/multiple', exportarController.generarMultiple);
router.post('/programar', exportarController.programar);
router.get('/historial', exportarController.getHistorial);
router.get('/descargar/:id', exportarController.descargar);
router.get('/estado/:id', exportarController.getEstado);
router.delete('/:id', exportarController.eliminar);

module.exports = router;

