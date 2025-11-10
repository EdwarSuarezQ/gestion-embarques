const Factura = require('../models/Factura');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');
const { buildQuery, buildSort, calculatePagination } = require('../utils/helpers');

exports.createFactura = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const factura = await Factura.create(req.body);
    successResponse(res, factura, 'Factura creada exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

exports.getFacturas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchFields = ['idFactura', 'cliente'];
    const query = buildQuery(req.query, searchFields);
    const sort = buildSort(req.query.sort);
    const facturas = await Factura.find(query).sort(sort).skip(skip).limit(limit);
    const total = await Factura.countDocuments(query);
    paginatedResponse(res, facturas, calculatePagination(page, limit, total));
  } catch (error) {
    next(error);
  }
};

exports.getFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findById(req.params.id);
    if (!factura) return errorResponse(res, 'Factura no encontrada', 404);
    successResponse(res, factura);
  } catch (error) {
    next(error);
  }
};

exports.updateFactura = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);
    const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!factura) return errorResponse(res, 'Factura no encontrada', 404);
    successResponse(res, factura, 'Factura actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.patchFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!factura) return errorResponse(res, 'Factura no encontrada', 404);
    successResponse(res, factura, 'Factura actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.deleteFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndDelete(req.params.id);
    if (!factura) return errorResponse(res, 'Factura no encontrada', 404);
    successResponse(res, null, 'Factura eliminada exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getFacturasByEstado = async (req, res, next) => {
  try {
    const facturas = await Factura.find({ estado: req.params.estado });
    successResponse(res, facturas);
  } catch (error) {
    next(error);
  }
};

exports.pagarFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndUpdate(req.params.id, { estado: 'paid' }, { new: true });
    if (!factura) return errorResponse(res, 'Factura no encontrada', 404);
    successResponse(res, factura, 'Factura marcada como pagada');
  } catch (error) {
    next(error);
  }
};

exports.getFacturasByCliente = async (req, res, next) => {
  try {
    const facturas = await Factura.find({ cliente: { $regex: req.params.nombre, $options: 'i' } });
    successResponse(res, facturas);
  } catch (error) {
    next(error);
  }
};

exports.getFacturasPendientes = async (req, res, next) => {
  try {
    const facturas = await Factura.find({ estado: 'pending' });
    successResponse(res, facturas);
  } catch (error) {
    next(error);
  }
};

exports.updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    if (!['paid', 'pending', 'overdue', 'cancelled'].includes(estado)) {
      return errorResponse(res, 'Estado inválido', 400);
    }
    const factura = await Factura.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!factura) return errorResponse(res, 'Factura no encontrada', 404);
    successResponse(res, factura, 'Estado actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

exports.getEstadisticas = async (req, res, next) => {
  try {
    const total = await Factura.countDocuments();
    const pagadas = await Factura.countDocuments({ estado: 'paid' });
    const pendientes = await Factura.countDocuments({ estado: 'pending' });
    const vencidas = await Factura.countDocuments({ estado: 'overdue' });
    const result = await Factura.aggregate([{ $group: { _id: null, totalMonto: { $sum: '$monto' } } }]);
    const facturacionTotal = result[0]?.totalMonto || 0;
    const resultPagadas = await Factura.aggregate([
      { $match: { estado: 'paid' } },
      { $group: { _id: null, totalPagado: { $sum: '$monto' } } }
    ]);
    const facturasPagadas = resultPagadas[0]?.totalPagado || 0;
    const tasaCobro = facturacionTotal > 0 ? ((facturasPagadas / facturacionTotal) * 100).toFixed(2) : '0.00';
    successResponse(res, {
      facturacionTotal,
      facturasPagadas: pagadas,
      facturasPendientes: pendientes,
      facturasVencidas: vencidas,
      tasaCobro: `${tasaCobro}%`
    });
  } catch (error) {
    next(error);
  }
};

