const exportacionService = require('../services/exportacionService');
const Exportacion = require('../models/Exportacion');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const fs = require('fs');
const path = require('path');

// @desc    Obtener tipos de reporte disponibles
// @route   GET /api/exportar/tipos
// @access  Public
exports.getTipos = async (req, res, next) => {
  try {
    const tipos = exportacionService.getTiposReporte();
    successResponse(res, tipos);
  } catch (error) {
    next(error);
  }
};

// @desc    Generar exportación
// @route   POST /api/exportar/generar
// @access  Public
exports.generar = async (req, res, next) => {
  try {
    const { tipo, formato, modulo, campos, filtros } = req.body;

    if (!tipo || !formato || !modulo || !campos) {
      return errorResponse(res, 'Faltan parámetros requeridos', 400);
    }

    if (!['csv', 'json', 'pdf', 'xlsx'].includes(formato)) {
      return errorResponse(res, 'Formato no válido', 400);
    }

    const exportacion = await exportacionService.generarExportacion(
      tipo,
      formato,
      modulo,
      campos,
      filtros || {},
      null // Sin usuario
    );

    successResponse(res, exportacion, 'Exportación generada exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Generar múltiples exportaciones
// @route   POST /api/exportar/multiple
// @access  Public
exports.generarMultiple = async (req, res, next) => {
  try {
    const { exportaciones } = req.body;

    if (!Array.isArray(exportaciones) || exportaciones.length === 0) {
      return errorResponse(res, 'Debe proporcionar un array de exportaciones', 400);
    }

    const resultados = await Promise.allSettled(
      exportaciones.map(exp =>
        exportacionService.generarExportacion(
          exp.tipo,
          exp.formato,
          exp.modulo,
          exp.campos,
          exp.filtros || {},
          null // Sin usuario
        )
      )
    );

    const exitosas = resultados.filter(r => r.status === 'fulfilled').map(r => r.value);
    const fallidas = resultados.filter(r => r.status === 'rejected').map(r => r.reason.message);

    successResponse(res, {
      exitosas,
      fallidas,
      total: exportaciones.length,
      exitosasCount: exitosas.length,
      fallidasCount: fallidas.length
    }, 'Exportaciones múltiples procesadas');
  } catch (error) {
    next(error);
  }
};

// @desc    Programar exportación
// @route   POST /api/exportar/programar
// @access  Public
exports.programar = async (req, res, next) => {
  try {
    const { tipo, formato, modulo, campos, filtros, fechaProgramada } = req.body;

    // Por ahora, creamos la exportación con estado pending
    // En una implementación completa, usarías un sistema de colas como Bull
    const exportacion = await Exportacion.create({
      tipo,
      formato,
      modulo,
      campos,
      filtros: filtros || {},
      estado: 'pending',
      creadoPor: null // Sin usuario
    });

    successResponse(res, exportacion, 'Exportación programada exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener historial de exportaciones
// @route   GET /api/exportar/historial
// @access  Public
exports.getHistorial = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const historial = await exportacionService.getHistorial(null, limit);
    successResponse(res, historial);
  } catch (error) {
    next(error);
  }
};

// @desc    Descargar archivo de exportación
// @route   GET /api/exportar/descargar/:id
// @access  Public
exports.descargar = async (req, res, next) => {
  try {
    const exportacion = await Exportacion.findById(req.params.id);

    if (!exportacion) {
      return errorResponse(res, 'Exportación no encontrada', 404);
    }

    if (exportacion.estado !== 'completed') {
      return errorResponse(res, 'La exportación no está completada', 400);
    }

    if (!fs.existsSync(exportacion.rutaArchivo)) {
      return errorResponse(res, 'El archivo no existe', 404);
    }

    res.download(exportacion.rutaArchivo, exportacion.archivo);
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar exportación
// @route   DELETE /api/exportar/:id
// @access  Public
exports.eliminar = async (req, res, next) => {
  try {
    const exportacion = await Exportacion.findById(req.params.id);

    if (!exportacion) {
      return errorResponse(res, 'Exportación no encontrada', 404);
    }

    // Eliminar archivo si existe
    if (exportacion.rutaArchivo && fs.existsSync(exportacion.rutaArchivo)) {
      fs.unlinkSync(exportacion.rutaArchivo);
    }

    await Exportacion.findByIdAndDelete(req.params.id);
    successResponse(res, null, 'Exportación eliminada exitosamente');
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estado de exportación
// @route   GET /api/exportar/estado/:id
// @access  Public
exports.getEstado = async (req, res, next) => {
  try {
    const exportacion = await Exportacion.findById(req.params.id);

    if (!exportacion) {
      return errorResponse(res, 'Exportación no encontrada', 404);
    }

    successResponse(res, {
      id: exportacion._id,
      estado: exportacion.estado,
      archivo: exportacion.archivo,
      tamano: exportacion.tamano,
      error: exportacion.error,
      createdAt: exportacion.createdAt,
      completedAt: exportacion.completedAt
    });
  } catch (error) {
    next(error);
  }
};

