const Tarea = require('../models/Tarea');
const Embarque = require('../models/Embarque');
const Factura = require('../models/Factura');
const Personal = require('../models/Personal');
const Ruta = require('../models/Ruta');
const Embarcacion = require('../models/Embarcacion');
const Almacen = require('../models/Almacen');
const Exportacion = require('../models/Exportacion');
const exportCsv = require('../utils/exportCsv');
const exportJson = require('../utils/exportJson');
const exportPdf = require('../utils/exportPdf');
const exportExcel = require('../utils/exportExcel');
const path = require('path');

// Tipos de reporte predefinidos
const TIPOS_REPORTE = [
  {
    id: 'tareas',
    nombre: 'Reporte de Tareas',
    descripcion: 'Incluye todas las tareas, estados y asignaciones',
    icono: 'tasks',
    color: 'blue',
    modulo: 'tareas',
    campos: ['titulo', 'descripcion', 'asignado', 'fecha', 'prioridad', 'estado', 'departamento']
  },
  {
    id: 'embarques',
    nombre: 'Reporte de Embarques',
    descripcion: 'Detalles de todos los embarques y su estado actual',
    icono: 'ship',
    color: 'green',
    modulo: 'embarques',
    campos: ['idEmbarque', 'buque', 'imo', 'origen', 'destino', 'fechaEstimada', 'teus', 'tipoCarga', 'estado', 'distancia']
  },
  {
    id: 'facturacion',
    nombre: 'Reporte de Facturación',
    descripcion: 'Estado de facturas y pagos pendientes',
    icono: 'invoice',
    color: 'orange',
    modulo: 'facturas',
    campos: ['idFactura', 'cliente', 'fechaEmision', 'monto', 'estado']
  },
  {
    id: 'personal',
    nombre: 'Reporte de Personal',
    descripcion: 'Información del personal y asignaciones',
    icono: 'users',
    color: 'purple',
    modulo: 'personal',
    campos: ['nombre', 'email', 'puesto', 'departamento', 'estado']
  }
];

// Mapeo de módulos a modelos
const MODELOS = {
  tareas: Tarea,
  embarques: Embarque,
  facturas: Factura,
  personal: Personal,
  rutas: Ruta,
  embarcaciones: Embarcacion,
  almacenes: Almacen
};

// Obtener datos del módulo
const obtenerDatos = async (modulo, filtros = {}) => {
  const Modelo = MODELOS[modulo];
  if (!Modelo) {
    throw new Error(`Módulo ${modulo} no encontrado`);
  }

  const query = {};
  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.fechaDesde) query.createdAt = { $gte: new Date(filtros.fechaDesde) };
  if (filtros.fechaHasta) {
    query.createdAt = { ...query.createdAt, $lte: new Date(filtros.fechaHasta) };
  }

  const datos = await Modelo.find(query).lean();
  return datos;
};

// Generar exportación
exports.generarExportacion = async (tipo, formato, modulo, campos, filtros, usuarioId) => {
  let exportacion = null;
  try {
    // Crear registro de exportación
    exportacion = await Exportacion.create({
      tipo,
      formato,
      modulo,
      filtros,
      estado: 'processing',
      creadoPor: usuarioId
    });

    // Obtener datos
    const datos = await obtenerDatos(modulo, filtros);

    // Preparar ruta de destino
    const rutaDestino = path.join(process.cwd(), 'uploads', 'exports');
    const nombreArchivo = `${tipo}_${Date.now()}`;

    let rutaArchivo;

    // Exportar según formato
    switch (formato) {
      case 'csv':
        rutaArchivo = await exportCsv.exportToCSV(datos, campos, nombreArchivo, rutaDestino);
        break;
      case 'json':
        rutaArchivo = await exportJson.exportToJSON(datos, nombreArchivo, rutaDestino);
        break;
      case 'pdf':
        const reporte = TIPOS_REPORTE.find(r => r.id === tipo);
        rutaArchivo = await exportPdf.exportToPDF(
          datos,
          campos,
          nombreArchivo,
          rutaDestino,
          reporte?.nombre || 'Reporte'
        );
        break;
      case 'xlsx':
        rutaArchivo = await exportExcel.exportToExcel(datos, campos, nombreArchivo, rutaDestino);
        break;
      default:
        throw new Error(`Formato ${formato} no soportado`);
    }

    // Obtener tamaño del archivo
    const fs = require('fs');
    const stats = fs.statSync(rutaArchivo);
    const tamano = stats.size;

    // Actualizar exportación
    exportacion.estado = 'completed';
    exportacion.archivo = path.basename(rutaArchivo);
    exportacion.rutaArchivo = rutaArchivo;
    exportacion.tamano = tamano;
    exportacion.completedAt = new Date();
    await exportacion.save();

    return exportacion;
  } catch (error) {
    // Actualizar exportación con error
    if (exportacion) {
      exportacion.estado = 'failed';
      exportacion.error = error.message;
      await exportacion.save();
    }
    throw error;
  }
};

// Obtener tipos de reporte
exports.getTiposReporte = () => {
  return TIPOS_REPORTE;
};

// Obtener historial de exportaciones
exports.getHistorial = async (usuarioId, limit = 10) => {
  const query = usuarioId ? { creadoPor: usuarioId } : {};
  const exportaciones = await Exportacion.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('creadoPor', 'nombre email');
  return exportaciones;
};

