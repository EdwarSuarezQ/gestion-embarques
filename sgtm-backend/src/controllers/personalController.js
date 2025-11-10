const Personal = require('../models/Personal');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { buildQuery, buildSort, calculatePagination } = require('../utils/helpers');

exports.createPersonal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const personal = await Personal.create(req.body);
    successResponse(res, personal, 'Personal creado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.getPersonal = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchFields = ['nombre', 'email', 'puesto', 'departamento'];
    const query = buildQuery(req.query, searchFields);
    const sort = buildSort(req.query.sort);
    const personal = await Personal.find(query).sort(sort).skip(skip).limit(limit);
    const total = await Personal.countDocuments(query);
    paginatedResponse(res, personal, calculatePagination(page, limit, total));
  } catch (error) {
    next(error);
  }
};

exports.getPersonalById = async (req, res, next) => {
  try {
    const personal = await Personal.findById(req.params.id);
    if (!personal) return errorResponse(res, 'Personal no encontrado', 404);
    successResponse(res, personal);
  } catch (error) {
    next(error);
  }
};

exports.updatePersonal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const personal = await Personal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!personal) return errorResponse(res, 'Personal no encontrado', 404);
    successResponse(res, personal, 'Personal actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.patchPersonal = async (req, res, next) => {
  try {
    const personal = await Personal.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!personal) return errorResponse(res, 'Personal no encontrado', 404);
    successResponse(res, personal, 'Personal actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deletePersonal = async (req, res, next) => {
  try {
    const personal = await Personal.findByIdAndDelete(req.params.id);
    if (!personal) return errorResponse(res, 'Personal no encontrado', 404);
    successResponse(res, null, 'Personal eliminado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getPersonalByDepartamento = async (req, res, next) => {
  try {
    const personal = await Personal.find({ departamento: { $regex: req.params.depto, $options: 'i' } });
    successResponse(res, personal);
  } catch (error) {
    next(error);
  }
};

exports.updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    if (!['active', 'inactive'].includes(estado)) return errorResponse(res, 'Estado inválido', 400);
    const personal = await Personal.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!personal) return errorResponse(res, 'Personal no encontrado', 404);
    successResponse(res, personal, 'Estado actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getPersonalActivos = async (req, res, next) => {
  try {
    const personal = await Personal.find({ estado: 'active' });
    successResponse(res, personal);
  } catch (error) {
    next(error);
  }
};

exports.getPersonalByPuesto = async (req, res, next) => {
  try {
    const personal = await Personal.find({ puesto: { $regex: req.params.puesto, $options: 'i' } });
    successResponse(res, personal);
  } catch (error) {
    next(error);
  }
};

exports.getPersonalByEmail = async (req, res, next) => {
  try {
    const personal = await Personal.findOne({ email: req.params.email });
    if (!personal) return errorResponse(res, 'Personal no encontrado', 404);
    successResponse(res, personal);
  } catch (error) {
    next(error);
  }
};

exports.getEstadisticas = async (req, res, next) => {
  try {
    const total = await Personal.countDocuments();
    const activos = await Personal.countDocuments({ estado: 'active' });
    const departamentos = await Personal.distinct('departamento');
    successResponse(res, { total, activos, totalDepartamentos: departamentos.length });
  } catch (error) {
    next(error);
  }
};

