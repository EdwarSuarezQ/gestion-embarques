import express from 'express';
import {
  getFacturas,
  getFactura,
  createFactura,
  updateFactura,
  patchFactura,
  deleteFactura,
  getFacturasByEstado,
  pagarFactura,
  getFacturasByCliente,
  getEstadisticasFacturas,
} from '../controllers/facturasController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getFacturas);
router.get('/estadisticas', authenticate, getEstadisticasFacturas);
router.get('/estado/:estado', authenticate, getFacturasByEstado);
router.get('/cliente/:nombre', authenticate, getFacturasByCliente);
router.get('/:id', authenticate, getFactura);
router.post('/', authenticate, createFactura);
router.put('/:id', authenticate, updateFactura);
router.put('/:id/pagar', authenticate, pagarFactura);
router.patch('/:id', authenticate, patchFactura);
router.delete('/:id', authenticate, deleteFactura);

export default router;
