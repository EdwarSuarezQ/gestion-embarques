const express = require('express');
const router = require('express').Router();
const estadisticasController = require('../controllers/estadisticasController');

router.get('/generales', estadisticasController.getGenerales);
router.get('/distribucion', estadisticasController.getDistribucion);
router.get('/indicadores', estadisticasController.getIndicadores);
router.get('/filtradas', estadisticasController.getFiltradas);
router.get('/tendencias', estadisticasController.getTendencias);
router.get('/dashboard', estadisticasController.getDashboard);

module.exports = router;

