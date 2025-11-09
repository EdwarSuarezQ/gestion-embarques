import Tarea from '../models/Tarea.js';
import Embarque from '../models/Embarque.js';
import Ruta from '../models/Ruta.js';
import Factura from '../models/Factura.js';
import Personal from '../models/Personal.js';
import Embarcacion from '../models/Embarcacion.js';
import Almacen from '../models/Almacen.js';
import { exportToCSV } from '../utils/exportCsv.js';
import { exportToExcel } from '../utils/exportExcel.js';
import { exportToPDF } from '../utils/exportPdf.js';
import { exportToJSON } from '../utils/exportJson.js';

const modelos = {
  tareas: Tarea,
  embarques: Embarque,
  rutas: Ruta,
  facturas: Factura,
  personal: Personal,
  embarcaciones: Embarcacion,
  almacenes: Almacen,
};

const tiposReporte = {
  tareas: {
    id: 'tareas',
    nombre: 'Reporte de Tareas',
    descripcion: 'Incluye todas las tareas, estados y asignaciones',
    icono: 'tasks',
    color: 'blue',
    campos: [
      { key: 'titulo', label: 'Título' },
      { key: 'descripcion', label: 'Descripción' },
      { key: 'asignado', label: 'Asignado' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'prioridad', label: 'Prioridad' },
      { key: 'estado', label: 'Estado' },
      { key: 'departamento', label: 'Departamento' },
    ],
  },
  embarques: {
    id: 'embarques',
    nombre: 'Reporte de Embarques',
    descripcion: 'Detalles de todos los embarques y su estado actual',
    icono: 'ship',
    color: 'green',
    campos: [
      { key: 'idEmbarque', label: 'ID Embarque' },
      { key: 'buque', label: 'Buque' },
      { key: 'imo', label: 'IMO' },
      { key: 'origen', label: 'Origen' },
      { key: 'destino', label: 'Destino' },
      { key: 'fechaEstimada', label: 'Fecha Estimada' },
      { key: 'teus', label: 'TEUs' },
      { key: 'tipoCarga', label: 'Tipo de Carga' },
      { key: 'estado', label: 'Estado' },
    ],
  },
  rutas: {
    id: 'rutas',
    nombre: 'Reporte de Rutas',
    descripcion: 'Información de todas las rutas marítimas',
    icono: 'route',
    color: 'purple',
    campos: [
      { key: 'idRuta', label: 'ID Ruta' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'origen', label: 'Origen' },
      { key: 'paisOrigen', label: 'País Origen' },
      { key: 'destino', label: 'Destino' },
      { key: 'paisDestino', label: 'País Destino' },
      { key: 'distancia', label: 'Distancia' },
      { key: 'duracion', label: 'Duración' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'estado', label: 'Estado' },
    ],
  },
  facturas: {
    id: 'facturas',
    nombre: 'Reporte de Facturas',
    descripcion: 'Detalles de todas las facturas',
    icono: 'file-invoice',
    color: 'yellow',
    campos: [
      { key: 'idFactura', label: 'ID Factura' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'fechaEmision', label: 'Fecha Emisión' },
      { key: 'monto', label: 'Monto' },
      { key: 'estado', label: 'Estado' },
    ],
  },
  personal: {
    id: 'personal',
    nombre: 'Reporte de Personal',
    descripcion: 'Información del personal',
    icono: 'users',
    color: 'orange',
    campos: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'email', label: 'Email' },
      { key: 'puesto', label: 'Puesto' },
      { key: 'departamento', label: 'Departamento' },
      { key: 'estado', label: 'Estado' },
    ],
  },
  embarcaciones: {
    id: 'embarcaciones',
    nombre: 'Reporte de Embarcaciones',
    descripcion: 'Detalles de todas las embarcaciones',
    icono: 'anchor',
    color: 'teal',
    campos: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'imo', label: 'IMO' },
      { key: 'origen', label: 'Origen' },
      { key: 'destino', label: 'Destino' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'capacidad', label: 'Capacidad' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'estado', label: 'Estado' },
    ],
  },
  almacenes: {
    id: 'almacenes',
    nombre: 'Reporte de Almacenes',
    descripcion: 'Información de todos los almacenes',
    icono: 'warehouse',
    color: 'gray',
    campos: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'ubicacion', label: 'Ubicación' },
      { key: 'capacidad', label: 'Capacidad' },
      { key: 'ocupacion', label: 'Ocupación (%)' },
      { key: 'estado', label: 'Estado' },
      { key: 'proximoMantenimiento', label: 'Próximo Mantenimiento' },
    ],
  },
};

export const getTiposReporte = () => {
  return Object.values(tiposReporte);
};

export const generarReporte = async (tipoReporte, formato, filtros = {}) => {
  const reporteConfig = tiposReporte[tipoReporte];
  if (!reporteConfig) {
    throw new Error(`Tipo de reporte no válido: ${tipoReporte}`);
  }

  const Modelo = modelos[tipoReporte];
  if (!Modelo) {
    throw new Error(`Modelo no encontrado para: ${tipoReporte}`);
  }

  // Aplicar filtros
  const query = Modelo.find(filtros);
  const data = await query.lean();

  // Preparar datos para exportación
  const datosExportar = data.map((item) => {
    const obj = {};
    reporteConfig.campos.forEach((campo) => {
      obj[campo.key] = item[campo.key] || '';
    });
    return obj;
  });

  // Generar nombre de archivo
  const timestamp = Date.now();
  const extension = formato === 'xlsx' ? 'xlsx' : formato;
  const filename = `${tipoReporte}_${timestamp}.${extension}`;

  let resultado;

  switch (formato) {
    case 'csv':
      resultado = await exportToCSV(datosExportar, reporteConfig.campos, filename);
      break;
    case 'xlsx':
      resultado = await exportToExcel(datosExportar, reporteConfig.campos, filename);
      break;
    case 'pdf':
      resultado = await exportToPDF(
        datosExportar,
        reporteConfig.campos,
        filename,
        reporteConfig.nombre
      );
      break;
    case 'json':
      resultado = await exportToJSON(datosExportar, filename);
      break;
    default:
      throw new Error(`Formato no soportado: ${formato}`);
  }

  return {
    ...resultado,
    tipo: tipoReporte,
    formato,
    registros: data.length,
  };
};
