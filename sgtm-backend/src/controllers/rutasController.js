const Ruta = require('../models/Ruta');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { buildQuery, buildSort, calculatePagination } = require('../utils/helpers');

exports.createRuta = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }
    const ruta = await Ruta.create(req.body);
    successResponse(res, ruta, 'Ruta creada exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.getRutas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchFields = ['idRuta', 'nombre', 'origen', 'destino', 'paisOrigen', 'paisDestino'];
    const query = buildQuery(req.query, searchFields);
    const sort = buildSort(req.query.sort);
    const rutas = await Ruta.find(query).sort(sort).skip(skip).limit(limit);
    const total = await Ruta.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);
    paginatedResponse(res, rutas, pagination);
  } catch (error) {
    next(error);
  }
};

exports.getRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.findById(req.params.id);
    if (!ruta) return errorResponse(res, 'Ruta no encontrada', 404);
    successResponse(res, ruta);
  } catch (error) {
    next(error);
  }
};

exports.updateRuta = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }
    const ruta = await Ruta.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ruta) return errorResponse(res, 'Ruta no encontrada', 404);
    successResponse(res, ruta, 'Ruta actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.patchRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!ruta) return errorResponse(res, 'Ruta no encontrada', 404);
    successResponse(res, ruta, 'Ruta actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deleteRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.findByIdAndDelete(req.params.id);
    if (!ruta) return errorResponse(res, 'Ruta no encontrada', 404);
    successResponse(res, null, 'Ruta eliminada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getRutasActivas = async (req, res, next) => {
  try {
    const rutas = await Ruta.find({ estado: 'active' });
    successResponse(res, rutas);
  } catch (error) {
    next(error);
  }
};

exports.getRutasByTipo = async (req, res, next) => {
  try {
    const rutas = await Ruta.find({ tipo: req.params.tipo });
    successResponse(res, rutas);
  } catch (error) {
    next(error);
  }
};

exports.getRutasByOrigen = async (req, res, next) => {
  try {
    const rutas = await Ruta.find({ origen: { $regex: req.params.ciudad, $options: 'i' } });
    successResponse(res, rutas);
  } catch (error) {
    next(error);
  }
};

exports.getRutasInternacionales = async (req, res, next) => {
  try {
    const rutas = await Ruta.find({ tipo: 'international' });
    successResponse(res, rutas);
  } catch (error) {
    next(error);
  }
};

exports.updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    if (!['active', 'pending', 'completed', 'inactive'].includes(estado)) {
      return errorResponse(res, 'Estado inválido', 400);
    }
    const ruta = await Ruta.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!ruta) return errorResponse(res, 'Ruta no encontrada', 404);
    successResponse(res, ruta, 'Estado actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getEstadisticas = async (req, res, next) => {
  try {
    const total = await Ruta.countDocuments();
    const activas = await Ruta.countDocuments({ estado: 'active' });
    const internacionales = await Ruta.countDocuments({ tipo: 'international' });
    const result = await Ruta.aggregate([{ $group: { _id: null, totalViajes: { $sum: '$viajesAnio' } } }]);
    const totalViajes = result[0]?.totalViajes || 0;
    successResponse(res, { total, activas, internacionales, totalViajes });
  } catch (error) {
    next(error);
  }
};

