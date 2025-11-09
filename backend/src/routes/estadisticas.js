import express from 'express';
import {
  getEstadisticasGenerales,
  getDistribucion,
  getIndicadores,
  getEstadisticasFiltradas,
} from '../controllers/estadisticasController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/generales', authenticate, getEstadisticasGenerales);
router.get('/distribucion', authenticate, getDistribucion);
router.get('/indicadores', authenticate, getIndicadores);
router.get('/filtradas', authenticate, getEstadisticasFiltradas);

export default router;
