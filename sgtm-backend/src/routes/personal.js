const express = require('express');
const router = require('express').Router();
const personalController = require('../controllers/personalController');
const { validatePersonal, validatePagination } = require('../utils/validators');

router.post('/', validatePersonal, personalController.createPersonal);
router.get('/', validatePagination, personalController.getPersonal);
router.get('/estadisticas', personalController.getEstadisticas);
router.get('/departamento/:depto', personalController.getPersonalByDepartamento);
router.get('/puesto/:puesto', personalController.getPersonalByPuesto);
router.get('/email/:email', personalController.getPersonalByEmail);
router.get('/activos', personalController.getPersonalActivos);
router.get('/:id', personalController.getPersonalById);
router.put('/:id', validatePersonal, personalController.updatePersonal);
router.patch('/:id', personalController.patchPersonal);
router.put('/:id/estado', personalController.updateEstado);
router.delete('/:id', personalController.deletePersonal);

module.exports = router;

