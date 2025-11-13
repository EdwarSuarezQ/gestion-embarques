const Embarque = require("../models/Embarque");
const Tarea = require("../models/Tarea");
const Personal = require("../models/Personal");
const apiResponse = require("../utils/apiResponse");

const estadisticasController = {
  // Obtener todas las estadísticas consolidadas
  getEstadisticas: async (req, res, next) => {
    try {
      // Obtener datos de embarques
      const embarques = await Embarque.find();
      const tareas = await Tarea.find();
      const personal = await Personal.find();

      // Calcular métricas
      const embarquesTotales = embarques.length;
      const teusMovilizados = embarques.reduce(
        (acc, e) => acc + (parseFloat(e.teus) || 0),
        0
      );
      const embarquesCompletados = embarques.filter(
        (e) => e.estado === "completado" || e.estado === "completed"
      ).length;
      const embarquesTransito = embarques.filter(
        (e) =>
          e.estado === "transito" ||
          e.estado === "in-progress" ||
          e.estado === "in-transit"
      ).length;
      const embarquesPendientes = embarques.filter(
        (e) => e.estado === "pendiente" || e.estado === "pending"
      ).length;

      //Calcular embarques en retraso
      const embarquesRetraso = embarques.filter((embarque) => {
        if (
          embarque.estado === "completed" ||
          embarque.estado === "completado"
        ) {
          return false;
        }

        try {
          // Convertir fechaEstimada "dd/mm/yyyy - HH:mm" a Date
          const [fechaPart, horaPart] = embarque.fechaEstimada.split(" - ");
          const [dia, mes, anio] = fechaPart.split("/");
          const fechaEstimada = new Date(`${anio}-${mes}-${dia}T${horaPart}`);
          const ahora = new Date();

          return fechaEstimada < ahora; // Retrasado si la fecha ya pasó
        } catch (error) {
          console.error(
            "Error procesando fecha:",
            embarque.fechaEstimada,
            error
          );
          return false;
        }
      }).length;

      const incidentes = embarques.filter(
        (e) => e.incidente || e.estado === "incidente"
      ).length;
      const tareasPendientes = tareas.filter(
        (t) => t.estado === "pending" || t.estado === "pendiente"
      ).length;
      const tareasCompletadas = tareas.filter(
        (t) => t.estado === "completed" || t.estado === "completado"
      ).length;
      const personalActivo = personal.filter(
        (p) => p.estado === "active" || p.estado === "activo"
      ).length;
      const personalTotal = personal.length;
      const tiempoPromedio = calcularTiempoPromedio(embarques);
      const variacionMensual = await calcularVariacionMensual(embarques);

      const estadisticas = {
        embarquesTotales,
        teusMovilizados,
        embarquesCompletados,
        embarquesTransito,
        embarquesPendientes,
        embarquesRetraso,
        incidentes,
        tareasPendientes,
        tareasCompletadas,
        personalActivo,
        personalTotal,
        tiempoPromedio,
        variacionMensual,
        actualizado: new Date(),
      };

      return apiResponse.success(
        res,
        estadisticas,
        "Estadísticas obtenidas correctamente"
      );
    } catch (error) {
      next(error);
    }
  },

  // Obtener estadísticas por período
  getEstadisticasPorPeriodo: async (req, res, next) => {
    try {
      const { periodo } = req.params;
      const fechaFiltro = calcularFechasPorPeriodo(periodo);

      const embarques = await Embarque.find({
        createdAt: { $gte: fechaFiltro.inicio, $lte: fechaFiltro.fin },
      });
      const tareas = await Tarea.find({
        createdAt: { $gte: fechaFiltro.inicio, $lte: fechaFiltro.fin },
      });
      const personal = await Personal.find();

      const estadisticas = calcularMetricasCompletas(
        embarques,
        tareas,
        personal
      );
      return apiResponse.success(
        res,
        estadisticas,
        `Estadísticas del ${periodo}`
      );
    } catch (error) {
      next(error);
    }
  },

  // Obtener estadísticas por tipo de carga
  getEstadisticasPorTipo: async (req, res, next) => {
    try {
      const { tipo } = req.params;
      const embarques = await Embarque.find({ tipoCarga: tipo });
      const tareas = await Tarea.find();
      const personal = await Personal.find();

      const estadisticas = calcularMetricasCompletas(
        embarques,
        tareas,
        personal
      );
      return apiResponse.success(
        res,
        estadisticas,
        `Estadísticas para ${tipo}`
      );
    } catch (error) {
      next(error);
    }
  },
};

// Funciones auxiliares (mantener las que ya tienes)
function calcularTiempoPromedio(embarques) {
  if (!embarques || embarques.length === 0) return "0 días";
  let totalDias = 0;
  let embarquesConTiempo = 0;

  embarques.forEach((embarque) => {
    if (embarque.createdAt) {
      const fechaCreacion = new Date(embarque.createdAt);
      const hoy = new Date();
      const diffTime = hoy - fechaCreacion;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDias += diffDays;
      embarquesConTiempo++;
    }
  });

  if (embarquesConTiempo === 0) return "0 días";
  return (totalDias / embarquesConTiempo).toFixed(1) + " días";
}

async function calcularVariacionMensual(embarques) {
  try {
    const mesActual = new Date().getMonth();
    const anioActual = new Date().getFullYear();
    const embarquesEsteMes = embarques.filter((e) => {
      const fecha = new Date(e.createdAt);
      return (
        fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual
      );
    });

    const primerDiaMesAnterior = new Date(anioActual, mesActual - 1, 1);
    const ultimoDiaMesAnterior = new Date(anioActual, mesActual, 0);
    const embarquesMesAnterior = await Embarque.find({
      createdAt: { $gte: primerDiaMesAnterior, $lte: ultimoDiaMesAnterior },
    });

    if (embarquesMesAnterior.length === 0) return "+0%";
    const variacion =
      ((embarquesEsteMes.length - embarquesMesAnterior.length) /
        embarquesMesAnterior.length) *
      100;
    return (variacion > 0 ? "+" : "") + variacion.toFixed(1) + "%";
  } catch (error) {
    return "+0%";
  }
}

function calcularFechasPorPeriodo(periodo) {
  const hoy = new Date();
  let inicio, fin;

  switch (periodo) {
    case "mes":
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      break;
    case "trimestre":
      const trimestreActual = Math.floor(hoy.getMonth() / 3);
      inicio = new Date(hoy.getFullYear(), trimestreActual * 3, 1);
      fin = new Date(hoy.getFullYear(), (trimestreActual + 1) * 3, 0);
      break;
    case "anio":
      inicio = new Date(hoy.getFullYear(), 0, 1);
      fin = new Date(hoy.getFullYear(), 11, 31);
      break;
    default:
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      fin = hoy;
  }

  return { inicio, fin };
}

function calcularMetricasCompletas(embarques, tareas, personal) {
  const embarquesTotales = embarques.length;
  const teusMovilizados = embarques.reduce(
    (acc, e) => acc + (parseFloat(e.teus) || 0),
    0
  );
  const embarquesCompletados = embarques.filter(
    (e) => e.estado === "completado" || e.estado === "completed"
  ).length;
  const embarquesTransito = embarques.filter(
    (e) =>
      e.estado === "transito" ||
      e.estado === "in-progress" ||
      e.estado === "in-transit"
  ).length;
  const embarquesPendientes = embarques.filter(
    (e) => e.estado === "pendiente" || e.estado === "pending"
  ).length;

  // ✅ NUEVO: Calcular embarques en retraso
  const embarquesRetraso = embarques.filter((embarque) => {
    if (embarque.estado === "completed" || embarque.estado === "completado") {
      return false;
    }

    try {
      const [fechaPart, horaPart] = embarque.fechaEstimada.split(" - ");
      const [dia, mes, anio] = fechaPart.split("/");
      const fechaEstimada = new Date(`${anio}-${mes}-${dia}T${horaPart}`);
      const ahora = new Date();

      return fechaEstimada < ahora;
    } catch (error) {
      console.error("Error procesando fecha:", embarque.fechaEstimada, error);
      return false;
    }
  }).length;

  const incidentes = embarques.filter(
    (e) => e.incidente || e.estado === "incidente"
  ).length;
  const tareasPendientes = tareas.filter(
    (t) => t.estado === "pending" || t.estado === "pendiente"
  ).length;
  const tareasCompletadas = tareas.filter(
    (t) => t.estado === "completed" || t.estado === "completado"
  ).length;
  const personalActivo = personal.filter(
    (p) => p.estado === "active" || p.estado === "activo"
  ).length;
  const personalTotal = personal.length;

  return {
    embarquesTotales,
    teusMovilizados,
    embarquesCompletados,
    embarquesTransito,
    embarquesPendientes,
    embarquesRetraso,
    incidentes,
    tareasPendientes,
    tareasCompletadas,
    personalActivo,
    personalTotal,
    tiempoPromedio: calcularTiempoPromedio(embarques),
    variacionMensual: "+0%",
    actualizado: new Date(),
  };
}

module.exports = estadisticasController;
