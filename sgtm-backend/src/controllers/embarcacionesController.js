const Embarcacion = require('../models/Embarcacion');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { buildQuery, buildSort, calculatePagination } = require('../utils/helpers');

exports.createEmbarcacion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const embarcacion = await Embarcacion.create(req.body);
    successResponse(res, embarcacion, 'Embarcación creada exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.getEmbarcaciones = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchFields = ['nombre', 'imo', 'origen', 'destino'];
    const query = buildQuery(req.query, searchFields);
    const sort = buildSort(req.query.sort);
    const embarcaciones = await Embarcacion.find(query).sort(sort).skip(skip).limit(limit);
    const total = await Embarcacion.countDocuments(query);
    paginatedResponse(res, embarcaciones, calculatePagination(page, limit, total));
  } catch (error) {
    next(error);
  }
};

exports.getEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.findById(req.params.id);
    if (!embarcacion) return errorResponse(res, 'Embarcación no encontrada', 404);
    successResponse(res, embarcacion);
  } catch (error) {
    next(error);
  }
};

exports.updateEmbarcacion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const embarcacion = await Embarcacion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!embarcacion) return errorResponse(res, 'Embarcación no encontrada', 404);
    successResponse(res, embarcacion, 'Embarcación actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.patchEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!embarcacion) return errorResponse(res, 'Embarcación no encontrada', 404);
    successResponse(res, embarcacion, 'Embarcación actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deleteEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.findByIdAndDelete(req.params.id);
    if (!embarcacion) return errorResponse(res, 'Embarcación no encontrada', 404);
    successResponse(res, null, 'Embarcación eliminada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getEstadisticas = async (req, res, next) => {
  try {
    const total = await Embarcacion.countDocuments();
    const activas = await Embarcacion.countDocuments({ estado: { $in: ['in-transit', 'in-route'] } });
    const enPuerto = await Embarcacion.countDocuments({ estado: 'in-port' });
    const enTransito = await Embarcacion.countDocuments({ estado: 'in-transit' });
    successResponse(res, { total, activas, enPuerto, enTransito });
  } catch (error) {
    next(error);
  }
};

