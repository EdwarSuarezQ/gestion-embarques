import express from 'express';
import {
  getEmbarcaciones,
  getEmbarcacion,
  createEmbarcacion,
  updateEmbarcacion,
  patchEmbarcacion,
  deleteEmbarcacion,
  getEstadisticasEmbarcaciones,
} from '../controllers/embarcacionesController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getEmbarcaciones);
router.get('/estadisticas', authenticate, getEstadisticasEmbarcaciones);
router.get('/:id', authenticate, getEmbarcacion);
router.post('/', authenticate, createEmbarcacion);
router.put('/:id', authenticate, updateEmbarcacion);
router.patch('/:id', authenticate, patchEmbarcacion);
router.delete('/:id', authenticate, deleteEmbarcacion);

export default router;
