import express from 'express';
import {
  getTipos,
  generar,
  exportarMultiple,
  programar,
  getHistorial,
  descargar,
} from '../controllers/exportarController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/tipos', authenticate, getTipos);
router.get('/historial', authenticate, getHistorial);
router.get('/descargar/:id', authenticate, descargar);
router.post('/generar', authenticate, generar);
router.post('/multiple', authenticate, exportarMultiple);
router.post('/programar', authenticate, programar);

export default router;
