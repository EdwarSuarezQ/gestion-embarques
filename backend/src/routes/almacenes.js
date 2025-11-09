import express from 'express';
import {
  getAlmacenes,
  getAlmacen,
  createAlmacen,
  updateAlmacen,
  patchAlmacen,
  deleteAlmacen,
  getAlmacenesByOcupacion,
  getProximosMantenimientos,
  getAlmacenesByEstado,
  getEstadisticasAlmacenes,
} from '../controllers/almacenesController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAlmacenes);
router.get('/estadisticas', authenticate, getEstadisticasAlmacenes);
router.get('/ocupacion/:nivel', authenticate, getAlmacenesByOcupacion);
router.get('/mantenimiento/proximos', authenticate, getProximosMantenimientos);
router.get('/estado/:estado', authenticate, getAlmacenesByEstado);
router.get('/:id', authenticate, getAlmacen);
router.post('/', authenticate, createAlmacen);
router.put('/:id', authenticate, updateAlmacen);
router.patch('/:id', authenticate, patchAlmacen);
router.delete('/:id', authenticate, deleteAlmacen);

export default router;
