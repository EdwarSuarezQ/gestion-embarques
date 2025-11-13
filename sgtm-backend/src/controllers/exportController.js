const Embarque = require("../models/Embarque");
const Tarea = require("../models/Tarea");
const Personal = require("../models/Personal");
const Ruta = require("../models/Ruta");
const Factura = require("../models/Factura");
const Embarcacion = require("../models/Embarcacion");
const Almacen = require("../models/Almacen");
const apiResponse = require("../utils/apiResponse");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const exportController = {
  // Obtener tipos de reporte disponibles
  getTiposReporte: async (req, res, next) => {
    try {
      const tipos = [
        {
          id: "embarques",
          nombre: "Reporte de Embarques",
          descripcion: "Listado completo de embarques con estados y detalles",
          icono: "ship",
          color: "blue",
          disponible: true,
        },
        {
          id: "tareas",
          nombre: "Reporte de Tareas",
          descripcion: "Tareas pendientes, en progreso y completadas",
          icono: "tasks",
          color: "green",
          disponible: true,
        },
        {
          id: "rutas",
          nombre: "Reporte de Rutas",
          descripcion: "Rutas de transporte y logística",
          icono: "route",
          color: "purple",
          disponible: true,
        },
        {
          id: "facturas",
          nombre: "Reporte de Facturas",
          descripcion: "Facturas emitidas y estado de pago",
          icono: "file-invoice-dollar",
          color: "orange",
          disponible: true,
        },
        {
          id: "personal",
          nombre: "Reporte de Personal",
          descripcion: "Información del personal y asignaciones",
          icono: "users",
          color: "red",
          disponible: true,
        },
        {
          id: "embarcaciones",
          nombre: "Reporte de Embarcaciones",
          descripcion: "Flota de embarcaciones y estado técnico",
          icono: "anchor",
          color: "indigo",
          disponible: true,
        },
        {
          id: "almacenes",
          nombre: "Reporte de Almacenes",
          descripcion: "Inventario y estado de almacenes",
          icono: "warehouse",
          color: "yellow",
          disponible: true,
        },
      ];

      return apiResponse.success(
        res,
        tipos,
        "Tipos de reporte obtenidos correctamente"
      );
    } catch (error) {
      next(error);
    }
  },

  // Generar reporte específico - ENVIAR DIRECTAMENTE AL CLIENTE
  generarReporte: async (req, res, next) => {
    try {
      const { tipo, formato, filtros = {} } = req.body;

      if (!tipo || !formato) {
        return apiResponse.badRequest(res, "Tipo y formato son requeridos");
      }

      let datos;
      let nombreArchivo;

      switch (tipo) {
        case "embarques":
          datos = await obtenerDatosEmbarques(filtros);
          nombreArchivo = `reporte_embarques_${Date.now()}`;
          break;

        case "tareas":
          datos = await obtenerDatosTareas(filtros);
          nombreArchivo = `reporte_tareas_${Date.now()}`;
          break;

        case "rutas":
          datos = await obtenerDatosRutas(filtros);
          nombreArchivo = `reporte_rutas_${Date.now()}`;
          break;

        case "facturas":
          datos = await obtenerDatosFacturas(filtros);
          nombreArchivo = `reporte_facturas_${Date.now()}`;
          break;

        case "personal":
          datos = await obtenerDatosPersonal(filtros);
          nombreArchivo = `reporte_personal_${Date.now()}`;
          break;

        case "embarcaciones":
          datos = await obtenerDatosEmbarcaciones(filtros);
          nombreArchivo = `reporte_embarcaciones_${Date.now()}`;
          break;

        case "almacenes":
          datos = await obtenerDatosAlmacenes(filtros);
          nombreArchivo = `reporte_almacenes_${Date.now()}`;
          break;

        default:
          return apiResponse.badRequest(res, "Tipo de reporte no válido");
      }

      // ENVIAR DIRECTAMENTE AL CLIENTE SIN GUARDAR ARCHIVOS
      await enviarReporteDirecto(res, datos, formato, nombreArchivo, tipo);
    } catch (error) {
      next(error);
    }
  },
};

// NUEVA FUNCIÓN: Enviar reporte directamente al cliente
async function enviarReporteDirecto(
  res,
  datos,
  formato,
  nombreArchivo,
  tipoReporte
) {
  try {
    switch (formato.toLowerCase()) {
      case "csv":
        const csvContent = convertirACSV(datos);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${nombreArchivo}.csv"`
        );
        res.send(csvContent);
        break;

      case "json":
        const jsonContent = JSON.stringify(datos, null, 2);
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${nombreArchivo}.json"`
        );
        res.send(jsonContent);
        break;

      case "txt":
        const txtContent = convertirATexto(datos);
        res.setHeader("Content-Type", "text/plain");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${nombreArchivo}.txt"`
        );
        res.send(txtContent);
        break;

      case "excel":
        const excelBuffer = await convertirAExcel(datos, tipoReporte);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${nombreArchivo}.xlsx"`
        );
        res.send(excelBuffer);
        break;

      case "pdf":
        const pdfBuffer = await convertirAPDF(datos, tipoReporte);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${nombreArchivo}.pdf"`
        );
        res.send(pdfBuffer);
        break;

      default:
        return apiResponse.badRequest(res, "Formato no soportado");
    }
  } catch (error) {
    console.error("Error enviando reporte:", error);
    return apiResponse.error(res, "Error generando el reporte");
  }
}

// Funciones auxiliares para obtener datos (mantener igual)
async function obtenerDatosEmbarques(filtros) {
  const query = construirQuery(filtros);
  const embarques = await Embarque.find(query);

  return embarques.map((emb) => ({
    ID_Embarque: emb.idEmbarque,
    Buque: emb.buque,
    IMO: emb.imo,
    Origen: emb.origen,
    Destino: emb.destino,
    Estado: emb.estado,
    Tipo_Carga: emb.tipoCarga,
    TEUs: emb.teus,
    Fecha_Estimada: emb.fechaEstimada,
    Distancia: emb.distancia,
    Creado: emb.createdAt,
  }));
}

async function obtenerDatosTareas(filtros) {
  const query = construirQuery(filtros);
  const tareas = await Tarea.find(query);

  return tareas.map((tarea) => ({
    Titulo: tarea.titulo,
    Descripcion: tarea.descripcion,
    Asignado: tarea.asignado,
    Fecha: tarea.fecha,
    Prioridad: tarea.prioridad,
    Estado: tarea.estado,
    Departamento: tarea.departamento,
    Creado: tarea.createdAt,
  }));
}

async function obtenerDatosRutas(filtros) {
  const query = construirQuery(filtros);
  const rutas = await Ruta.find(query);

  return rutas.map((ruta) => ({
    ID_Ruta: ruta.idRuta,
    Nombre: ruta.nombre,
    Origen: ruta.origen,
    Pais_Origen: ruta.paisOrigen,
    Destino: ruta.destino,
    Pais_Destino: ruta.paisDestino,
    Distancia: ruta.distancia,
    Duracion: ruta.duracion,
    Tipo: ruta.tipo,
    Estado: ruta.estado,
    Viajes_Anio: ruta.viajesAnio,
    Creado: ruta.createdAt,
  }));
}

async function obtenerDatosFacturas(filtros) {
  const query = construirQuery(filtros);
  const facturas = await Factura.find(query);

  return facturas.map((factura) => ({
    ID_Factura: factura.idFactura,
    Cliente: factura.cliente,
    Fecha_Emision: factura.fechaEmision,
    Monto: factura.monto,
    Estado: factura.estado,
    Creado: factura.createdAt,
  }));
}

async function obtenerDatosPersonal(filtros) {
  const query = construirQuery(filtros);
  const personal = await Personal.find(query);

  return personal.map((persona) => ({
    Nombre: persona.nombre,
    Email: persona.email,
    Puesto: persona.puesto,
    Departamento: persona.departamento,
    Estado: persona.estado,
    Creado: persona.createdAt,
  }));
}

async function obtenerDatosEmbarcaciones(filtros) {
  const query = construirQuery(filtros);
  const embarcaciones = await Embarcacion.find(query);

  return embarcaciones.map((emb) => ({
    Nombre: emb.nombre,
    IMO: emb.imo,
    Origen: emb.origen,
    Destino: emb.destino,
    Fecha: emb.fecha,
    Capacidad: emb.capacidad,
    Tipo: emb.tipo,
    Estado: emb.estado,
    Creado: emb.createdAt,
  }));
}

async function obtenerDatosAlmacenes(filtros) {
  const query = construirQuery(filtros);
  const almacenes = await Almacen.find(query);

  return almacenes.map((alm) => ({
    Nombre: alm.nombre,
    Ubicacion: alm.ubicacion,
    Capacidad: alm.capacidad,
    Ocupacion: `${alm.ocupacion}%`,
    Estado: alm.estado,
    Proximo_Mantenimiento: alm.proximoMantenimiento,
    Creado: alm.createdAt,
  }));
}

function construirQuery(filtros) {
  const query = {};

  if (filtros.estado && filtros.estado !== "todos") {
    const estadoMapeado = mapearEstado(filtros.estado);
    if (estadoMapeado) {
      query.estado = { $in: estadoMapeado };
    }
  }

  if (filtros.fechaDesde && filtros.fechaHasta) {
    query.createdAt = {
      $gte: new Date(filtros.fechaDesde),
      $lte: new Date(filtros.fechaHasta),
    };
  }

  return query;
}

function mapearEstado(estadoGenerico) {
  const mapeoEstados = {
    activo: [
      "active",
      "operativo",
      "in-transit",
      "in-route",
      "in-port",
      "paid",
    ],
    completado: ["completed"],
    pendiente: ["pending"],
    "en-progreso": ["in-progress", "loading", "unloading"],
  };

  return mapeoEstados[estadoGenerico];
}

// Funciones de conversión (mantener igual)
async function convertirAExcel(datos, tipoReporte) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte");

  // Título
  worksheet.mergeCells("A1:H1");
  worksheet.getCell("A1").value = `Reporte de ${obtenerNombreReporte(
    tipoReporte
  )}`;
  worksheet.getCell("A1").font = { size: 16, bold: true };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  // Fecha de generación
  worksheet.mergeCells("A2:H2");
  worksheet.getCell("A2").value = `Generado el: ${new Date().toLocaleString()}`;
  worksheet.getCell("A2").alignment = { horizontal: "center" };
  worksheet.getCell("A2").font = { italic: true };

  // Espacio
  worksheet.addRow([]);

  // Encabezados y datos
  if (datos.length > 0) {
    const headers = Object.keys(datos[0]);
    worksheet.addRow(headers);

    // Estilo para encabezados
    const headerRow = worksheet.getRow(4);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6E6FA" },
    };

    // Datos
    datos.forEach((item) => {
      const row = Object.values(item);
      worksheet.addRow(row);
    });

    // Auto ajustar columnas
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(maxLength + 2, 50);
    });
  } else {
    worksheet.addRow(["No hay datos disponibles"]);
  }

  return await workbook.xlsx.writeBuffer();
}

async function convertirAPDF(datos, tipoReporte) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Título
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(`Reporte de ${obtenerNombreReporte(tipoReporte)}`, {
          align: "center",
        });

      doc.moveDown(0.5);

      // Fecha
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Generado el: ${new Date().toLocaleString()}`, {
          align: "center",
        });

      doc.moveDown(1);

      // Tabla de datos
      if (datos.length > 0) {
        const headers = Object.keys(datos[0]);
        let yPosition = doc.y;

        // Encabezados
        doc.fontSize(12).font("Helvetica-Bold");
        headers.forEach((header, index) => {
          doc.text(header, 50 + index * 120, yPosition, {
            width: 110,
            align: "left",
          });
        });

        doc
          .moveTo(50, yPosition + 20)
          .lineTo(50 + headers.length * 120, yPosition + 20)
          .stroke();

        yPosition += 30;

        // Datos
        doc.fontSize(10).font("Helvetica");
        datos.forEach((item, rowIndex) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          Object.values(item).forEach((value, colIndex) => {
            const text =
              value !== null && value !== undefined ? value.toString() : "";
            doc.text(text.substring(0, 20), 50 + colIndex * 120, yPosition, {
              width: 110,
              align: "left",
              ellipsis: true,
            });
          });
          yPosition += 20;
        });
      } else {
        doc.fontSize(12).text("No hay datos disponibles", { align: "center" });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function obtenerNombreReporte(tipoReporte) {
  const nombres = {
    embarques: "Embarques",
    tareas: "Tareas",
    rutas: "Rutas",
    facturas: "Facturas",
    personal: "Personal",
    embarcaciones: "Embarcaciones",
    almacenes: "Almacenes",
  };
  return nombres[tipoReporte] || "Datos";
}

function convertirACSV(datos) {
  if (Array.isArray(datos) && datos.length > 0) {
    const headers = Object.keys(datos[0]);
    const rows = datos.map((obj) =>
      headers
        .map((header) => {
          const value = obj[header];
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }
  return "No hay datos disponibles";
}

function convertirATexto(datos) {
  if (Array.isArray(datos) && datos.length > 0) {
    return datos
      .map((item, index) => {
        const entries = Object.entries(item);
        return `Registro ${index + 1}:\n${entries
          .map(([key, value]) => `  ${key}: ${value}`)
          .join("\n")}`;
      })
      .join("\n\n" + "=".repeat(50) + "\n\n");
  }
  return "No hay datos disponibles";
}

module.exports = exportController;
