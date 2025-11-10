const express = require('express');
const router = require('express').Router();
const almacenesController = require('../controllers/almacenesController');
const { protect } = require('../middleware/auth');
const { validateAlmacen, validatePagination } = require('../utils/validators');

router.post('/', protect, validateAlmacen, almacenesController.createAlmacen);
router.get('/', protect, validatePagination, almacenesController.getAlmacenes);
router.get('/estadisticas', protect, almacenesController.getEstadisticas);
router.get('/ocupacion/:nivel', protect, almacenesController.getAlmacenesByOcupacion);
router.get('/mantenimiento/proximos', protect, almacenesController.getProximosMantenimientos);
router.get('/estado/:estado', protect, almacenesController.getAlmacenesByEstado);
router.get('/capacidad/:min/:max', protect, almacenesController.getAlmacenesByCapacidad);
router.get('/:id', protect, almacenesController.getAlmacen);
router.put('/:id', protect, validateAlmacen, almacenesController.updateAlmacen);
router.patch('/:id', protect, almacenesController.patchAlmacen);
router.put('/:id/ocupacion', protect, almacenesController.updateOcupacion);
router.delete('/:id', protect, almacenesController.deleteAlmacen);

module.exports = router;

