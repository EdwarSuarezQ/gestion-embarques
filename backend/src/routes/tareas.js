import express from 'express';
import {
  getTareas,
  getTarea,
  createTarea,
  updateTarea,
  patchTarea,
  deleteTarea,
  getEstadisticasTareas,
} from '../controllers/tareasController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getTareas);
router.get('/estadisticas', authenticate, getEstadisticasTareas);
router.get('/:id', authenticate, getTarea);
router.post('/', authenticate, createTarea);
router.put('/:id', authenticate, updateTarea);
router.patch('/:id', authenticate, patchTarea);
router.delete('/:id', authenticate, deleteTarea);

export default router;
