const express = require('express');
const router = require('express').Router();
const personalController = require('../controllers/personalController');
const { protect } = require('../middleware/auth');
const { validatePersonal, validatePagination } = require('../utils/validators');

router.post('/', protect, validatePersonal, personalController.createPersonal);
router.get('/', protect, validatePagination, personalController.getPersonal);
router.get('/estadisticas', protect, personalController.getEstadisticas);
router.get('/departamento/:depto', protect, personalController.getPersonalByDepartamento);
router.get('/puesto/:puesto', protect, personalController.getPersonalByPuesto);
router.get('/email/:email', protect, personalController.getPersonalByEmail);
router.get('/activos', protect, personalController.getPersonalActivos);
router.get('/:id', protect, personalController.getPersonalById);
router.put('/:id', protect, validatePersonal, personalController.updatePersonal);
router.patch('/:id', protect, personalController.patchPersonal);
router.put('/:id/estado', protect, personalController.updateEstado);
router.delete('/:id', protect, personalController.deletePersonal);

module.exports = router;

