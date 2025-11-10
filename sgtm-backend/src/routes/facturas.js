const express = require('express');
const router = require('express').Router();
const facturasController = require('../controllers/facturasController');
const { protect } = require('../middleware/auth');
const { validateFactura, validatePagination } = require('../utils/validators');

router.post('/', protect, validateFactura, facturasController.createFactura);
router.get('/', protect, validatePagination, facturasController.getFacturas);
router.get('/estadisticas', protect, facturasController.getEstadisticas);
router.get('/estado/:estado', protect, facturasController.getFacturasByEstado);
router.get('/cliente/:nombre', protect, facturasController.getFacturasByCliente);
router.get('/pendientes', protect, facturasController.getFacturasPendientes);
router.get('/:id', protect, facturasController.getFactura);
router.put('/:id', protect, validateFactura, facturasController.updateFactura);
router.patch('/:id', protect, facturasController.patchFactura);
router.put('/:id/pagar', protect, facturasController.pagarFactura);
router.put('/:id/estado', protect, facturasController.updateEstado);
router.delete('/:id', protect, facturasController.deleteFactura);

module.exports = router;

