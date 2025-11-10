const express = require('express');
const router = require('express').Router();
const tareasController = require('../controllers/tareasController');
const { validateTarea, validatePagination } = require('../utils/validators');

router.post('/', validateTarea, tareasController.createTarea);
router.get('/', validatePagination, tareasController.getTareas);
router.get('/estadisticas', tareasController.getEstadisticas);
router.get('/:id', tareasController.getTarea);
router.put('/:id', validateTarea, tareasController.updateTarea);
router.patch('/:id', tareasController.patchTarea);
router.delete('/:id', tareasController.deleteTarea);

module.exports = router;

