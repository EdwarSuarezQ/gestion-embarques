const Tarea = require('../models/Tarea');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { buildQuery, buildSort, calculatePagination } = require('../utils/helpers');

// @desc    Crear nueva tarea
// @route   POST /api/tareas
// @access  Private
exports.createTarea = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const tarea = await Tarea.create(req.body);
    successResponse(res, tarea, 'Tarea creada exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todas las tareas con paginación
// @route   GET /api/tareas
// @access  Private
exports.getTareas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchFields = ['titulo', 'descripcion', 'asignado', 'departamento'];
    const query = buildQuery(req.query, searchFields);
    const sort = buildSort(req.query.sort);

    const tareas = await Tarea.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Tarea.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);

    paginatedResponse(res, tareas, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener tarea por ID
// @route   GET /api/tareas/:id
// @access  Private
exports.getTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return errorResponse(res, 'Tarea no encontrada', 404);
    }
    successResponse(res, tarea);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar tarea completa
// @route   PUT /api/tareas/:id
// @access  Private
exports.updateTarea = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tarea) {
      return errorResponse(res, 'Tarea no encontrada', 404);
    }

    successResponse(res, tarea, 'Tarea actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar tarea parcialmente
// @route   PATCH /api/tareas/:id
// @access  Private
exports.patchTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!tarea) {
      return errorResponse(res, 'Tarea no encontrada', 404);
    }

    successResponse(res, tarea, 'Tarea actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar tarea
// @route   DELETE /api/tareas/:id
// @access  Private
exports.deleteTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);
    if (!tarea) {
      return errorResponse(res, 'Tarea no encontrada', 404);
    }
    successResponse(res, null, 'Tarea eliminada exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de tareas
// @route   GET /api/tareas/estadisticas
// @access  Private
exports.getEstadisticas = async (req, res, next) => {
  try {
    const total = await Tarea.countDocuments();
    const pendientes = await Tarea.countDocuments({ estado: 'pending' });
    const enProgreso = await Tarea.countDocuments({ estado: 'in-progress' });
    const completadas = await Tarea.countDocuments({ estado: 'completed' });
    const altaPrioridad = await Tarea.countDocuments({ prioridad: 'high' });
    const eficiencia = total > 0 ? ((completadas / total) * 100).toFixed(2) : '0.00';

    successResponse(res, {
      total,
      pendientes,
      enProgreso,
      completadas,
      altaPrioridad,
      eficiencia: `${eficiencia}%`
    });
  } catch (error) {
    next(error);
  }
};

