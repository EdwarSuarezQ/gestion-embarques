const { validationResult } = require('express-validator');
const Tarea = require('../models/Tarea');
const apiResponse = require('../utils/apiResponse');

// Create
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.error(
        res,
        'Errores de validación',
        400,
        errors.array(),
      );
    const tarea = new Tarea(req.body);
    await tarea.save();
    return apiResponse.success(res, tarea, 'Tarea creada', 201);
  } catch (err) {
    next(err);
  }
};

// List with pagination & filters
exports.list = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      q,
      estado,
      prioridad,
      departamento,
    } = req.query;
    const filters = {};
    if (q)
      filters.$or = [
        { titulo: new RegExp(q, 'i') },
        { descripcion: new RegExp(q, 'i') },
        { asignado: new RegExp(q, 'i') },
      ];
    if (estado) filters.estado = estado;
    if (prioridad) filters.prioridad = prioridad;
    if (departamento) filters.departamento = departamento;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Tarea.find(filters).sort(sort).skip(skip).limit(parseInt(limit)),
      Tarea.countDocuments(filters),
    ]);
    return apiResponse.success(res, {
      items,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
};

// Get by id
exports.get = async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return apiResponse.notFound(res, 'Tarea no encontrada');
    return apiResponse.success(res, tarea);
  } catch (err) {
    next(err);
  }
};

// Update (put)
exports.update = async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tarea) return apiResponse.notFound(res, 'Tarea no encontrada');
    return apiResponse.success(res, tarea, 'Tarea actualizada');
  } catch (err) {
    next(err);
  }
};

// Patch (partial)
exports.patch = async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return apiResponse.notFound(res, 'Tarea no encontrada');
    Object.assign(tarea, req.body);
    await tarea.save();
    return apiResponse.success(res, tarea, 'Tarea actualizada parcialmente');
  } catch (err) {
    next(err);
  }
};

// Delete
exports.remove = async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);
    if (!tarea) return apiResponse.notFound(res, 'Tarea no encontrada');
    return apiResponse.success(res, {}, 'Tarea eliminada');
  } catch (err) {
    next(err);
  }
};

// Estadísticas (ejemplo simple)
exports.stats = async (req, res, next) => {
  try {
    const total = await Tarea.countDocuments();
    const pendientes = await Tarea.countDocuments({ estado: 'pending' });
    const completadas = await Tarea.countDocuments({ estado: 'completed' });
    const altaPrioridad = await Tarea.countDocuments({ prioridad: 'high' });
    return apiResponse.success(res, {
      total,
      pendientes,
      completadas,
      altaPrioridad,
    });
  } catch (err) {
    next(err);
  }
};
