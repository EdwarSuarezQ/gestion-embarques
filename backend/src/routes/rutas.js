import express from 'express';
import {
  getRutas,
  getRuta,
  createRuta,
  updateRuta,
  patchRuta,
  deleteRuta,
  getRutasActivas,
  getRutasByTipo,
  getRutasByOrigen,
  getEstadisticasRutas,
} from '../controllers/rutasController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getRutas);
router.get('/estadisticas', authenticate, getEstadisticasRutas);
router.get('/activas', authenticate, getRutasActivas);
router.get('/tipo/:tipo', authenticate, getRutasByTipo);
router.get('/origen/:ciudad', authenticate, getRutasByOrigen);
router.get('/:id', authenticate, getRuta);
router.post('/', authenticate, createRuta);
router.put('/:id', authenticate, updateRuta);
router.patch('/:id', authenticate, patchRuta);
router.delete('/:id', authenticate, deleteRuta);

export default router;
