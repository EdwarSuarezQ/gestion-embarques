import express from 'express';
import {
  getPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  patchPersonal,
  deletePersonal,
  getPersonalByDepartamento,
  cambiarEstadoPersonal,
  getPersonalActivos,
  getEstadisticasPersonal,
} from '../controllers/personalController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getPersonal);
router.get('/estadisticas', authenticate, getEstadisticasPersonal);
router.get('/activos', authenticate, getPersonalActivos);
router.get('/departamento/:depto', authenticate, getPersonalByDepartamento);
router.get('/:id', authenticate, getPersonalById);
router.post('/', authenticate, createPersonal);
router.put('/:id', authenticate, updatePersonal);
router.put('/:id/estado', authenticate, cambiarEstadoPersonal);
router.patch('/:id', authenticate, patchPersonal);
router.delete('/:id', authenticate, deletePersonal);

export default router;
