const express = require('express');
const router = require('express').Router();
const almacenesController = require('../controllers/almacenesController');
const { validateAlmacen, validatePagination } = require('../utils/validators');

router.post('/', validateAlmacen, almacenesController.createAlmacen);
router.get('/', validatePagination, almacenesController.getAlmacenes);
router.get('/estadisticas', almacenesController.getEstadisticas);
router.get('/ocupacion/:nivel', almacenesController.getAlmacenesByOcupacion);
router.get('/mantenimiento/proximos', almacenesController.getProximosMantenimientos);
router.get('/estado/:estado', almacenesController.getAlmacenesByEstado);
router.get('/capacidad/:min/:max', almacenesController.getAlmacenesByCapacidad);
router.get('/:id', almacenesController.getAlmacen);
router.put('/:id', validateAlmacen, almacenesController.updateAlmacen);
router.patch('/:id', almacenesController.patchAlmacen);
router.put('/:id/ocupacion', almacenesController.updateOcupacion);
router.delete('/:id', almacenesController.deleteAlmacen);

module.exports = router;

