const Embarque = require('../models/Embarque');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { buildQuery, buildSort, calculatePagination } = require('../utils/helpers');

// @desc    Crear nuevo embarque
// @route   POST /api/embarques
// @access  Private
exports.createEmbarque = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const embarque = await Embarque.create(req.body);
    successResponse(res, embarque, 'Embarque creado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los embarques
// @route   GET /api/embarques
// @access  Private
exports.getEmbarques = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchFields = ['idEmbarque', 'buque', 'imo', 'origen', 'destino'];
    const query = buildQuery(req.query, searchFields);
    const sort = buildSort(req.query.sort);

    const embarques = await Embarque.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Embarque.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);

    paginatedResponse(res, embarques, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener embarque por ID
// @route   GET /api/embarques/:id
// @access  Private
exports.getEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.findById(req.params.id);
    if (!embarque) {
      return errorResponse(res, 'Embarque no encontrado', 404);
    }
    successResponse(res, embarque);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar embarque
// @route   PUT /api/embarques/:id
// @access  Private
exports.updateEmbarque = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const embarque = await Embarque.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!embarque) {
      return errorResponse(res, 'Embarque no encontrado', 404);
    }

    successResponse(res, embarque, 'Embarque actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar embarque parcialmente
// @route   PATCH /api/embarques/:id
// @access  Private
exports.patchEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!embarque) {
      return errorResponse(res, 'Embarque no encontrado', 404);
    }

    successResponse(res, embarque, 'Embarque actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar embarque
// @route   DELETE /api/embarques/:id
// @access  Private
exports.deleteEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.findByIdAndDelete(req.params.id);
    if (!embarque) {
      return errorResponse(res, 'Embarque no encontrado', 404);
    }
    successResponse(res, null, 'Embarque eliminado exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener embarques por estado
// @route   GET /api/embarques/estado/:estado
// @access  Private
exports.getEmbarquesByEstado = async (req, res, next) => {
  try {
    const embarques = await Embarque.find({ estado: req.params.estado });
    successResponse(res, embarques);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener embarques por tipo
// @route   GET /api/embarques/tipo/:tipo
// @access  Private
exports.getEmbarquesByTipo = async (req, res, next) => {
  try {
    const embarques = await Embarque.find({ tipoCarga: req.params.tipo });
    successResponse(res, embarques);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener embarques por buque
// @route   GET /api/embarques/buque/:nombre
// @access  Private
exports.getEmbarquesByBuque = async (req, res, next) => {
  try {
    const embarques = await Embarque.find({ 
      buque: { $regex: req.params.nombre, $options: 'i' } 
    });
    successResponse(res, embarques);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener embarques activos
// @route   GET /api/embarques/activos
// @access  Private
exports.getEmbarquesActivos = async (req, res, next) => {
  try {
    const embarques = await Embarque.find({ 
      estado: { $in: ['in-transit', 'loading', 'unloading'] } 
    });
    successResponse(res, embarques);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar estado de embarque
// @route   PUT /api/embarques/:id/estado
// @access  Private
exports.updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    if (!['pending', 'in-transit', 'loading', 'unloading', 'completed'].includes(estado)) {
      return errorResponse(res, 'Estado inválido', 400);
    }

    const embarque = await Embarque.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!embarque) {
      return errorResponse(res, 'Embarque no encontrado', 404);
    }

    successResponse(res, embarque, 'Estado actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de embarques
// @route   GET /api/embarques/estadisticas
// @access  Private
exports.getEstadisticas = async (req, res, next) => {
  try {
    const total = await Embarque.countDocuments();
    const completados = await Embarque.countDocuments({ estado: 'completed' });
    const enTransito = await Embarque.countDocuments({ estado: 'in-transit' });
    const pendientes = await Embarque.countDocuments({ estado: 'pending' });
    
    const result = await Embarque.aggregate([
      { $group: { _id: null, totalTeus: { $sum: '$teus' } } }
    ]);
    const teusMovilizados = result[0]?.totalTeus || 0;
    
    const tasaCompletitud = total > 0 ? ((completados / total) * 100).toFixed(2) : '0.00';

    successResponse(res, {
      embarquesTotales: total,
      teusMovilizados,
      embarquesCompletados: completados,
      embarquesTransito: enTransito,
      embarquesPendientes: pendientes,
      tasaCompletitud: `${tasaCompletitud}%`
    });
  } catch (error) {
    next(error);
  }
};

