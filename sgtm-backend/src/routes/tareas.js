const express = require('express');
const router = require('express').Router();
const tareasController = require('../controllers/tareasController');
const { protect } = require('../middleware/auth');
const { validateTarea, validatePagination } = require('../utils/validators');

router.post('/', protect, validateTarea, tareasController.createTarea);
router.get('/', protect, validatePagination, tareasController.getTareas);
router.get('/estadisticas', protect, tareasController.getEstadisticas);
router.get('/:id', protect, tareasController.getTarea);
router.put('/:id', protect, validateTarea, tareasController.updateTarea);
router.patch('/:id', protect, tareasController.patchTarea);
router.delete('/:id', protect, tareasController.deleteTarea);

module.exports = router;

