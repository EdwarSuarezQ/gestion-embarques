const express = require('express');
const router = require('express').Router();
const facturasController = require('../controllers/facturasController');
const { validateFactura, validatePagination } = require('../utils/validators');

router.post('/', validateFactura, facturasController.createFactura);
router.get('/', validatePagination, facturasController.getFacturas);
router.get('/estadisticas', facturasController.getEstadisticas);
router.get('/estado/:estado', facturasController.getFacturasByEstado);
router.get('/cliente/:nombre', facturasController.getFacturasByCliente);
router.get('/pendientes', facturasController.getFacturasPendientes);
router.get('/:id', facturasController.getFactura);
router.put('/:id', validateFactura, facturasController.updateFactura);
router.patch('/:id', facturasController.patchFactura);
router.put('/:id/pagar', facturasController.pagarFactura);
router.put('/:id/estado', facturasController.updateEstado);
router.delete('/:id', facturasController.deleteFactura);

module.exports = router;

