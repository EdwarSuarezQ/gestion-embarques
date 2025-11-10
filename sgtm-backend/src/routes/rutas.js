const express = require('express');
const router = require('express').Router();
const rutasController = require('../controllers/rutasController');
const { validateRuta, validatePagination } = require('../utils/validators');

router.post('/', validateRuta, rutasController.createRuta);
router.get('/', validatePagination, rutasController.getRutas);
router.get('/estadisticas', rutasController.getEstadisticas);
router.get('/activas', rutasController.getRutasActivas);
router.get('/tipo/:tipo', rutasController.getRutasByTipo);
router.get('/origen/:ciudad', rutasController.getRutasByOrigen);
router.get('/internacionales', rutasController.getRutasInternacionales);
router.get('/:id', rutasController.getRuta);
router.put('/:id', validateRuta, rutasController.updateRuta);
router.patch('/:id', rutasController.patchRuta);
router.put('/:id/estado', rutasController.updateEstado);
router.delete('/:id', rutasController.deleteRuta);

module.exports = router;

