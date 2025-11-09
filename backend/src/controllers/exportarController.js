import Exportacion from '../models/Exportacion.js';
import { getTiposReporte, generarReporte } from '../services/exportacionService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Obtener tipos de reporte disponibles
// @route   GET /api/exportar/tipos
export const getTipos = async (req, res, next) => {
  try {
    const tipos = getTiposReporte();
    res.json({
      success: true,
      data: tipos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generar reporte específico
// @route   POST /api/exportar/generar
export const generar = async (req, res, next) => {
  try {
    const { tipo, formato, filtros } = req.body;

    if (!tipo || !formato) {
      return res.status(400).json({
        success: false,
        message: 'Tipo y formato son obligatorios',
      });
    }

    const resultado = await generarReporte(tipo, formato, filtros || {});

    // Guardar registro de exportación
    const exportacion = await Exportacion.create({
      tipo,
      formato,
      filtros: filtros || {},
      nombreArchivo: resultado.filename,
      rutaArchivo: resultado.filePath,
      tamano: resultado.size,
      estado: 'completed',
      usuario: req.user?.id,
    });

    res.json({
      success: true,
      data: {
        id: exportacion._id,
        ...resultado,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Exportación múltiple
// @route   POST /api/exportar/multiple
export const exportarMultiple = async (req, res, next) => {
  try {
    const { tipos, formato, filtros } = req.body;

    if (!tipos || !Array.isArray(tipos) || tipos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un tipo de reporte',
      });
    }

    const resultados = [];
    for (const tipo of tipos) {
      try {
        const resultado = await generarReporte(tipo, formato, filtros || {});
        resultados.push(resultado);
      } catch (error) {
        resultados.push({ tipo, error: error.message });
      }
    }

    res.json({
      success: true,
      data: resultados,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Programar exportación recurrente
// @route   POST /api/exportar/programar
export const programar = async (req, res, next) => {
  try {
    const { tipo, formato, filtros, frecuencia } = req.body;

    // Esta funcionalidad requeriría un sistema de jobs (como node-cron)
    // Por ahora solo guardamos la configuración
    const exportacion = await Exportacion.create({
      tipo,
      formato,
      filtros: filtros || {},
      estado: 'processing',
      usuario: req.user?.id,
    });

    res.json({
      success: true,
      message: 'Exportación programada (funcionalidad pendiente de implementar)',
      data: exportacion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener historial de exportaciones
// @route   GET /api/exportar/historial
export const getHistorial = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.user) {
      filter.usuario = req.user.id;
    }

    const exportaciones = await Exportacion.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('usuario', 'nombre email');

    const total = await Exportacion.countDocuments(filter);

    res.json({
      success: true,
      data: exportaciones,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Descargar archivo exportado
// @route   GET /api/exportar/descargar/:id
export const descargar = async (req, res, next) => {
  try {
    const exportacion = await Exportacion.findById(req.params.id);

    if (!exportacion) {
      return res.status(404).json({
        success: false,
        message: 'Exportación no encontrada',
      });
    }

    const filePath = exportacion.rutaArchivo;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado',
      });
    }

    res.download(filePath, exportacion.nombreArchivo, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};
