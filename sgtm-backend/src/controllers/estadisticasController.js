const estadisticasService = require('../services/estadisticasService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Obtener estadísticas generales
// @route   GET /api/estadisticas/generales
// @access  Private
exports.getGenerales = async (req, res, next) => {
  try {
    const estadisticas = await estadisticasService.getEstadisticasGenerales();
    successResponse(res, estadisticas);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener distribución de datos
// @route   GET /api/estadisticas/distribucion
// @access  Private
exports.getDistribucion = async (req, res, next) => {
  try {
    const distribucion = await estadisticasService.getDistribucion();
    successResponse(res, distribucion);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener indicadores clave
// @route   GET /api/estadisticas/indicadores
// @access  Private
exports.getIndicadores = async (req, res, next) => {
  try {
    const indicadores = await estadisticasService.getIndicadores();
    successResponse(res, indicadores);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas filtradas
// @route   GET /api/estadisticas/filtradas
// @access  Private
exports.getFiltradas = async (req, res, next) => {
  try {
    const estadisticas = await estadisticasService.getEstadisticasFiltradas(req.query);
    successResponse(res, estadisticas);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener tendencias
// @route   GET /api/estadisticas/tendencias
// @access  Private
exports.getTendencias = async (req, res, next) => {
  try {
    const tendencias = await estadisticasService.getTendencias();
    successResponse(res, tendencias);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener dashboard completo
// @route   GET /api/estadisticas/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const [generales, distribucion, indicadores, tendencias] = await Promise.all([
      estadisticasService.getEstadisticasGenerales(),
      estadisticasService.getDistribucion(),
      estadisticasService.getIndicadores(),
      estadisticasService.getTendencias()
    ]);

    successResponse(res, {
      generales,
      distribucion,
      indicadores,
      tendencias
    });
  } catch (error) {
    next(error);
  }
};

