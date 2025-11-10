const Almacen = require('../models/Almacen');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { buildQuery, buildSort, calculatePagination } = require('../utils/helpers');

exports.createAlmacen = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const almacen = await Almacen.create(req.body);
    successResponse(res, almacen, 'Almacén creado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAlmacenes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchFields = ['nombre', 'ubicacion'];
    const query = buildQuery(req.query, searchFields);
    const sort = buildSort(req.query.sort);
    const almacenes = await Almacen.find(query).sort(sort).skip(skip).limit(limit);
    const total = await Almacen.countDocuments(query);
    paginatedResponse(res, almacenes, calculatePagination(page, limit, total));
  } catch (error) {
    next(error);
  }
};

exports.getAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.findById(req.params.id);
    if (!almacen) return errorResponse(res, 'Almacén no encontrado', 404);
    successResponse(res, almacen);
  } catch (error) {
    next(error);
  }
};

exports.updateAlmacen = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const almacen = await Almacen.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!almacen) return errorResponse(res, 'Almacén no encontrado', 404);
    successResponse(res, almacen, 'Almacén actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.patchAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!almacen) return errorResponse(res, 'Almacén no encontrado', 404);
    successResponse(res, almacen, 'Almacén actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deleteAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.findByIdAndDelete(req.params.id);
    if (!almacen) return errorResponse(res, 'Almacén no encontrado', 404);
    successResponse(res, null, 'Almacén eliminado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getAlmacenesByOcupacion = async (req, res, next) => {
  try {
    const nivel = parseInt(req.params.nivel);
    const almacenes = await Almacen.find({ ocupacion: { $gte: nivel } });
    successResponse(res, almacenes);
  } catch (error) {
    next(error);
  }
};

exports.getProximosMantenimientos = async (req, res, next) => {
  try {
    const almacenes = await Almacen.find({ proximoMantenimiento: { $exists: true, $ne: null } });
    successResponse(res, almacenes);
  } catch (error) {
    next(error);
  }
};

exports.getAlmacenesByEstado = async (req, res, next) => {
  try {
    const almacenes = await Almacen.find({ estado: req.params.estado });
    successResponse(res, almacenes);
  } catch (error) {
    next(error);
  }
};

exports.getAlmacenesByCapacidad = async (req, res, next) => {
  try {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);
    const almacenes = await Almacen.find({ capacidad: { $gte: min, $lte: max } });
    successResponse(res, almacenes);
  } catch (error) {
    next(error);
  }
};

exports.updateOcupacion = async (req, res, next) => {
  try {
    const { ocupacion } = req.body;
    if (ocupacion < 0 || ocupacion > 100) return errorResponse(res, 'La ocupación debe estar entre 0 y 100', 400);
    const almacen = await Almacen.findByIdAndUpdate(req.params.id, { ocupacion }, { new: true });
    if (!almacen) return errorResponse(res, 'Almacén no encontrado', 404);
    successResponse(res, almacen, 'Ocupación actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getEstadisticas = async (req, res, next) => {
  try {
    const total = await Almacen.countDocuments();
    const operativos = await Almacen.countDocuments({ estado: 'operativo' });
    const result = await Almacen.aggregate([
      { $group: { _id: null, totalCapacidad: { $sum: '$capacidad' }, promedioOcupacion: { $avg: '$ocupacion' } } }
    ]);
    const capacidadTotal = result[0]?.totalCapacidad || 0;
    const ocupacionPromedio = result[0]?.promedioOcupacion || 0;
    successResponse(res, {
      total,
      operativos,
      capacidadTotal,
      ocupacionPromedio: `${ocupacionPromedio.toFixed(2)}%`
    });
  } catch (error) {
    next(error);
  }
};

