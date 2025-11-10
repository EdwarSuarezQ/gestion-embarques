const express = require('express');
const router = require('express').Router();
const estadisticasController = require('../controllers/estadisticasController');
const { protect } = require('../middleware/auth');

router.get('/generales', protect, estadisticasController.getGenerales);
router.get('/distribucion', protect, estadisticasController.getDistribucion);
router.get('/indicadores', protect, estadisticasController.getIndicadores);
router.get('/filtradas', protect, estadisticasController.getFiltradas);
router.get('/tendencias', protect, estadisticasController.getTendencias);
router.get('/dashboard', protect, estadisticasController.getDashboard);

module.exports = router;

