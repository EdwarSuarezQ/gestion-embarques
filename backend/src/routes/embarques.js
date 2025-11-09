import express from 'express';
import {
  getEmbarques,
  getEmbarque,
  createEmbarque,
  updateEmbarque,
  patchEmbarque,
  deleteEmbarque,
  getEmbarquesByEstado,
  getEmbarquesByTipo,
  getEmbarquesByBuque,
  getEstadisticasEmbarques,
} from '../controllers/embarquesController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getEmbarques);
router.get('/estadisticas', authenticate, getEstadisticasEmbarques);
router.get('/estado/:estado', authenticate, getEmbarquesByEstado);
router.get('/tipo/:tipo', authenticate, getEmbarquesByTipo);
router.get('/buque/:nombre', authenticate, getEmbarquesByBuque);
router.get('/:id', authenticate, getEmbarque);
router.post('/', authenticate, createEmbarque);
router.put('/:id', authenticate, updateEmbarque);
router.patch('/:id', authenticate, patchEmbarque);
router.delete('/:id', authenticate, deleteEmbarque);

export default router;
