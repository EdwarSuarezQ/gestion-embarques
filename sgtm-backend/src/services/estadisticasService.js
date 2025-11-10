const Tarea = require('../models/Tarea');
const Embarque = require('../models/Embarque');
const Factura = require('../models/Factura');
const Personal = require('../models/Personal');
const Embarcacion = require('../models/Embarcacion');
const Almacen = require('../models/Almacen');
const { getStartOfMonth, getEndOfMonth, getStartOfQuarter, getEndOfQuarter } = require('../utils/dateUtils');

// Obtener estadísticas generales
exports.getEstadisticasGenerales = async () => {
  // Embarques
  const embarquesTotales = await Embarque.countDocuments();
  const embarquesCompletados = await Embarque.countDocuments({ estado: 'completed' });
  const embarquesTransito = await Embarque.countDocuments({ estado: 'in-transit' });
  const embarquesPendientes = await Embarque.countDocuments({ estado: 'pending' });
  
  const resultTeus = await Embarque.aggregate([
    { $group: { _id: null, totalTeus: { $sum: '$teus' } } }
  ]);
  const teusMovilizados = resultTeus[0]?.totalTeus || 0;
  const tasaCompletitud = embarquesTotales > 0 
    ? ((embarquesCompletados / embarquesTotales) * 100).toFixed(2) 
    : '0.00';

  // Facturación
  const resultFacturacion = await Factura.aggregate([
    { $group: { _id: null, totalMonto: { $sum: '$monto' } } }
  ]);
  const facturacionTotal = resultFacturacion[0]?.totalMonto || 0;
  
  const facturasPagadas = await Factura.countDocuments({ estado: 'paid' });
  const facturasPendientes = await Factura.countDocuments({ estado: 'pending' });
  const facturasVencidas = await Factura.countDocuments({ estado: 'overdue' });
  
  const resultPagadas = await Factura.aggregate([
    { $match: { estado: 'paid' } },
    { $group: { _id: null, totalPagado: { $sum: '$monto' } } }
  ]);
  const montoPagado = resultPagadas[0]?.totalPagado || 0;
  const tasaCobro = facturacionTotal > 0 
    ? ((montoPagado / facturacionTotal) * 100).toFixed(2) 
    : '0.00';

  // Operaciones (Tareas)
  const tareasPendientes = await Tarea.countDocuments({ estado: 'pending' });
  const tareasCompletadas = await Tarea.countDocuments({ estado: 'completed' });
  const tareasAltaPrioridad = await Tarea.countDocuments({ prioridad: 'high' });
  const totalTareas = await Tarea.countDocuments();
  const eficienciaOperacional = totalTareas > 0 
    ? ((tareasCompletadas / totalTareas) * 100).toFixed(2) 
    : '0.00';

  // Recursos
  const personalActivo = await Personal.countDocuments({ estado: 'active' });
  const almacenesOperativos = await Almacen.countDocuments({ estado: 'operativo' });
  
  const resultCapacidad = await Almacen.aggregate([
    { $group: { _id: null, totalCapacidad: { $sum: '$capacidad' }, promedioOcupacion: { $avg: '$ocupacion' } } }
  ]);
  const capacidadTotal = resultCapacidad[0]?.totalCapacidad || 0;
  const ocupacionPromedio = resultCapacidad[0]?.promedioOcupacion || 0;

  // Embarcaciones
  const embarcacionesActivas = await Embarcacion.countDocuments({ 
    estado: { $in: ['in-transit', 'in-route'] } 
  });
  const embarcacionesPuerto = await Embarcacion.countDocuments({ estado: 'in-port' });
  const embarcacionesTransito = await Embarcacion.countDocuments({ estado: 'in-transit' });

  return {
    embarques: {
      embarquesTotales,
      teusMovilizados,
      embarquesCompletados,
      embarquesTransito,
      embarquesPendientes,
      tasaCompletitud: `${tasaCompletitud}%`
    },
    facturacion: {
      facturacionTotal,
      facturasPagadas,
      facturasPendientes,
      facturasVencidas,
      tasaCobro: `${tasaCobro}%`
    },
    operaciones: {
      tareasPendientes,
      tareasCompletadas,
      tareasAltaPrioridad,
      eficienciaOperacional: `${eficienciaOperacional}%`
    },
    recursos: {
      personalActivo,
      almacenesOperativos,
      capacidadTotal,
      ocupacionPromedio: `${ocupacionPromedio.toFixed(2)}%`
    },
    embarcaciones: {
      embarcacionesActivas,
      embarcacionesPuerto,
      embarcacionesTransito
    }
  };
};

// Obtener distribución de datos
exports.getDistribucion = async () => {
  const distribucionEmbarques = await Embarque.aggregate([
    { $group: { _id: '$tipoCarga', count: { $sum: 1 } } }
  ]);
  
  const distribucionFacturas = await Factura.aggregate([
    { $group: { _id: '$estado', count: { $sum: 1 } } }
  ]);
  
  const distribucionTareas = await Tarea.aggregate([
    { $group: { _id: '$estado', count: { $sum: 1 } } }
  ]);
  
  const distribucionPersonal = await Personal.aggregate([
    { $group: { _id: '$departamento', count: { $sum: 1 } } }
  ]);

  return {
    embarques: distribucionEmbarques,
    facturas: distribucionFacturas,
    tareas: distribucionTareas,
    personal: distribucionPersonal
  };
};

// Obtener indicadores clave
exports.getIndicadores = async () => {
  const embarquesTotales = await Embarque.countDocuments();
  const embarquesCompletados = await Embarque.countDocuments({ estado: 'completed' });
  const tasaCompletitud = embarquesTotales > 0 
    ? ((embarquesCompletados / embarquesTotales) * 100).toFixed(2) 
    : '0.00';

  const resultFacturacion = await Factura.aggregate([
    { $group: { _id: null, totalMonto: { $sum: '$monto' } } }
  ]);
  const facturacionTotal = resultFacturacion[0]?.totalMonto || 0;
  
  const resultPagadas = await Factura.aggregate([
    { $match: { estado: 'paid' } },
    { $group: { _id: null, totalPagado: { $sum: '$monto' } } }
  ]);
  const montoPagado = resultPagadas[0]?.totalPagado || 0;
  const tasaCobro = facturacionTotal > 0 
    ? ((montoPagado / facturacionTotal) * 100).toFixed(2) 
    : '0.00';

  const totalTareas = await Tarea.countDocuments();
  const tareasCompletadas = await Tarea.countDocuments({ estado: 'completed' });
  const eficienciaOperacional = totalTareas > 0 
    ? ((tareasCompletadas / totalTareas) * 100).toFixed(2) 
    : '0.00';

  return {
    tasaCompletitud: `${tasaCompletitud}%`,
    tasaCobro: `${tasaCobro}%`,
    eficienciaOperacional: `${eficienciaOperacional}%`
  };
};

// Obtener estadísticas filtradas
exports.getEstadisticasFiltradas = async (filtros) => {
  const query = {};
  if (filtros.fechaDesde) query.createdAt = { $gte: new Date(filtros.fechaDesde) };
  if (filtros.fechaHasta) {
    query.createdAt = { ...query.createdAt, $lte: new Date(filtros.fechaHasta) };
  }
  if (filtros.estado) query.estado = filtros.estado;

  const embarques = await Embarque.countDocuments(query);
  const facturas = await Factura.countDocuments(query);
  const tareas = await Tarea.countDocuments(query);

  return { embarques, facturas, tareas };
};

// Obtener tendencias
exports.getTendencias = async () => {
  const inicioMes = getStartOfMonth();
  const finMes = getEndOfMonth();
  const inicioTrimestre = getStartOfQuarter();
  const finTrimestre = getEndOfQuarter();

  // Embarques del mes
  const embarquesMes = await Embarque.countDocuments({
    createdAt: { $gte: inicioMes, $lte: finMes }
  });

  // Embarques del trimestre
  const embarquesTrimestre = await Embarque.countDocuments({
    createdAt: { $gte: inicioTrimestre, $lte: finTrimestre }
  });

  // Facturación del mes
  const resultFacturacionMes = await Factura.aggregate([
    { $match: { createdAt: { $gte: inicioMes, $lte: finMes } } },
    { $group: { _id: null, total: { $sum: '$monto' } } }
  ]);
  const facturacionMes = resultFacturacionMes[0]?.total || 0;

  // Facturación del trimestre
  const resultFacturacionTrimestre = await Factura.aggregate([
    { $match: { createdAt: { $gte: inicioTrimestre, $lte: finTrimestre } } },
    { $group: { _id: null, total: { $sum: '$monto' } } }
  ]);
  const facturacionTrimestre = resultFacturacionTrimestre[0]?.total || 0;

  return {
    variacionMensual: `${embarquesMes} embarques este mes`,
    crecimientoTrimestral: `${embarquesTrimestre} embarques este trimestre`,
    facturacionMensual: facturacionMes,
    facturacionTrimestral: facturacionTrimestre
  };
};

