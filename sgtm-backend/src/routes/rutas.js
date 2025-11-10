const express = require('express');
const router = require('express').Router();
const rutasController = require('../controllers/rutasController');
const { protect } = require('../middleware/auth');
const { validateRuta, validatePagination } = require('../utils/validators');

router.post('/', protect, validateRuta, rutasController.createRuta);
router.get('/', protect, validatePagination, rutasController.getRutas);
router.get('/estadisticas', protect, rutasController.getEstadisticas);
router.get('/activas', protect, rutasController.getRutasActivas);
router.get('/tipo/:tipo', protect, rutasController.getRutasByTipo);
router.get('/origen/:ciudad', protect, rutasController.getRutasByOrigen);
router.get('/internacionales', protect, rutasController.getRutasInternacionales);
router.get('/:id', protect, rutasController.getRuta);
router.put('/:id', protect, validateRuta, rutasController.updateRuta);
router.patch('/:id', protect, rutasController.patchRuta);
router.put('/:id/estado', protect, rutasController.updateEstado);
router.delete('/:id', protect, rutasController.deleteRuta);

module.exports = router;

