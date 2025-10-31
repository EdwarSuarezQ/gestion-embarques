let tiposReporte = obtenerTiposReporteEjemplo();

// Función de inicialización que se ejecutará cuando el módulo se cargue
function inicializarModulo() {
  console.log("Inicializando módulo...");
  // Mover el contenido de inicializar aquí

  renderizarExportarDatos();
  configurarEventos();
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarModulo);
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  inicializarModulo();
}

function obtenerTiposReporteEjemplo() {
  return [
    {
      id: "tareas",
      nombre: "Reporte de Tareas",
      descripcion: "Incluye todas las tareas, estados y asignaciones.",
      icono: "tasks",
      color: "blue",
    },
    {
      id: "embarques",
      nombre: "Reporte de Embarques",
      descripcion: "Detalles de todos los embarques y su estado actual.",
      icono: "ship",
      color: "green",
    },
    {
      id: "facturacion",
      nombre: "Reporte de Facturación",
      descripcion: "Registro de facturas emitidas y estado de pago.",
      icono: "file-invoice-dollar",
      color: "purple",
    },
    {
      id: "personal",
      nombre: "Reporte de Personal",
      descripcion: "Información detallada sobre el personal.",
      icono: "users",
      color: "orange",
    },
    {
      id: "estadisticas",
      nombre: "Reporte de Estadísticas",
      descripcion: "Métricas y análisis de rendimiento.",
      icono: "chart-bar",
      color: "red",
    },
    {
      id: "inventario",
      nombre: "Reporte de Inventario",
      descripcion: "Estado actual del inventario y stock.",
      icono: "box",
      color: "yellow",
    },
  ];
}

function renderizarExportarDatos() {
  const moduleContent = document.getElementById("module-content");
  if (!moduleContent) {
    console.error("No se encontró el module-content");
    return;
  }
  moduleContent.innerHTML = crearEstructuraCompleta();
}

function crearEstructuraCompleta() {
  return `
        <div class="exportar-datos-module">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="flex-1 max-w-md">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar reporte</label>
                            <div class="relative">
                                <input type="text" placeholder="Buscar tipo de reporte..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" id="buscar-reporte">
                                <div class="absolute left-3 top-2.5 text-gray-400"><i class="fas fa-search"></i></div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="formato-exportacion">
                                <option value="csv">CSV</option>
                                <option value="excel">Excel</option>
                                <option value="pdf">PDF</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2" id="btn-exportar-multiple">
                            <i class="fas fa-download"></i> Exportar Múltiple
                        </button>
                        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2" id="btn-programar-exportacion">
                            <i class="fas fa-clock"></i> Programar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Grid de tipos de reporte -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6" id="grid-reportes">
                ${tiposReporte
                  .map((reporte) => crearTarjetaReporte(reporte))
                  .join("")}
            </div>

            <!-- Panel avanzado -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Exportación Avanzada</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-medium text-gray-700 mb-3">Opciones de Filtrado</h3>
                        <div class="space-y-3">
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label><input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" id="filtro-fecha-desde"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label><input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" id="filtro-fecha-hasta"></div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                <select class="w-full px-3 py-2 border border-gray-300 rounded-md" id="filtro-estado">
                                    <option value="todos">Todos los estados</option>
                                    <option value="activo">Activo</option>
                                    <option value="completado">Completado</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-700 mb-3">Configuración de Exportación</h3>
                        <div class="space-y-3">
                            ${crearToggle(
                              "Incluir metadatos",
                              "toggle-metadatos",
                              true
                            )}
                            ${crearToggle(
                              "Comprimir archivo",
                              "toggle-comprimir",
                              false
                            )}
                            ${crearToggle(
                              "Incluir imágenes",
                              "toggle-imagenes",
                              false
                            )}
                            <button class="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2" id="btn-aplicar-config">
                                <i class="fas fa-cog"></i> Aplicar Configuración
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Historial -->
            <div class="bg-white rounded-lg shadow-md p-6 mt-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Historial de Exportaciones</h2>
                    <button class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1" id="btn-actualizar-historial">
                        <i class="fas fa-sync-alt"></i> Actualizar
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Archivo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" id="historial-exportaciones">
                            ${crearHistorialExportaciones()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function crearToggle(label, id, checked) {
  return `
        <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">${label}</span>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" id="${id}" ${
    checked ? "checked" : ""
  }>
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
        </div>
    `;
}

function crearTarjetaReporte(reporte) {
  return `
        <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-${reporte.color}-500 hover:shadow-lg transition-shadow cursor-pointer reporte-card" data-reporte="${reporte.id}">
            <div class="flex justify-between items-start mb-3">
                <div class="p-2 bg-${reporte.color}-100 rounded-md text-${reporte.color}-600">
                    <i class="fas fa-${reporte.icono}"></i>
                </div>
                <span class="text-xs font-medium px-2 py-1 rounded-full bg-${reporte.color}-100 text-${reporte.color}-800 formato-badge">CSV</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">${reporte.nombre}</h3>
            <p class="text-sm text-gray-600 mb-4">${reporte.descripcion}</p>
            <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">Última exportación: Hoy</span>
                <button class="text-${reporte.color}-600 hover:text-${reporte.color}-800 text-sm font-medium exportar-btn" data-reporte="${reporte.id}">
                    Exportar <i class="fas fa-arrow-down ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

function crearHistorialExportaciones() {
  const historial = [
    {
      archivo: "reporte_tareas_2024-01.csv",
      tipo: "Tareas",
      fecha: "Hoy, 10:30",
      tamaño: "2.4 MB",
      estado: "completado",
    },
    {
      archivo: "embarques_enero.pdf",
      tipo: "Embarques",
      fecha: "Ayer, 15:45",
      tamaño: "1.8 MB",
      estado: "completado",
    },
    {
      archivo: "facturacion_q4.xlsx",
      tipo: "Facturación",
      fecha: "05/01/2024",
      tamaño: "3.1 MB",
      estado: "completado",
    },
    {
      archivo: "personal_diciembre.csv",
      tipo: "Personal",
      fecha: "02/01/2024",
      tamaño: "1.2 MB",
      estado: "error",
    },
  ];

  return historial
    .map(
      (item) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${
                      item.archivo
                    }</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                  item.tipo
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                  item.fecha
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                  item.tamaño
                }</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.estado === "completado"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }">
                        ${item.estado === "completado" ? "Completado" : "Error"}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-800 mr-3 descargar-btn" data-archivo="${
                      item.archivo
                    }">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800 eliminar-btn" data-archivo="${
                      item.archivo
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    )
    .join("");
}

function configurarEventos() {
  console.log("Configurando eventos del módulo de exportación...");

  // Eventos para las tarjetas de reporte
  document.addEventListener("click", function (e) {
    const card = e.target.closest(".reporte-card");
    const exportarBtn = e.target.closest(".exportar-btn");

    if (card) {
      const tipoReporte = card.dataset.reporte;
      generarReporte(tipoReporte);
    }

    if (exportarBtn) {
      const tipoReporte = exportarBtn.dataset.reporte;
      generarReporte(tipoReporte);
    }
  });

  // Eventos para botones de acción
  document.addEventListener("click", function (e) {
    if (e.target.closest("#btn-exportar-multiple")) {
      exportarMultiple();
    }

    if (e.target.closest("#btn-programar-exportacion")) {
      mostrarModalProgramacion();
    }

    if (e.target.closest("#btn-aplicar-config")) {
      aplicarConfiguracion();
    }

    if (e.target.closest("#btn-actualizar-historial")) {
      actualizarHistorial();
    }

    const descargarBtn = e.target.closest(".descargar-btn");
    if (descargarBtn) {
      const archivo = descargarBtn.dataset.archivo;
      descargarArchivo(archivo);
    }

    const eliminarBtn = e.target.closest(".eliminar-btn");
    if (eliminarBtn) {
      const archivo = eliminarBtn.dataset.archivo;
      eliminarArchivo(archivo);
    }
  });

  // Evento para cambio de formato
  const formatoSelect = document.getElementById("formato-exportacion");
  if (formatoSelect) {
    formatoSelect.addEventListener("change", function (e) {
      actualizarFormatosTarjetas(e.target.value);
    });
  }

  // Evento para búsqueda
  const buscarInput = document.getElementById("buscar-reporte");
  if (buscarInput) {
    buscarInput.addEventListener("input", function (e) {
      filtrarReportes(e.target.value);
    });
  }
}

function generarReporte(tipoReporte) {
  const formato =
    document.getElementById("formato-exportacion")?.value || "csv";
  const reporte = tiposReporte.find((r) => r.id === tipoReporte);

  if (!reporte) {
    mostrarToast("Tipo de reporte no encontrado", "error");
    return;
  }

  mostrarToast(
    `Generando reporte de ${
      reporte.nombre
    } en formato ${formato.toUpperCase()}...`,
    "info"
  );

  setTimeout(() => {
    try {
      const datos = obtenerDatosParaReporte(tipoReporte);

      switch (formato) {
        case "csv":
          descargarCSV(datos, `reporte_${tipoReporte}`);
          break;
        case "excel":
          exportarExcel(datos, `reporte_${tipoReporte}`);
          break;
        case "pdf":
          exportarPDF(datos, `reporte_${tipoReporte}`);
          break;
        case "json":
          exportarJSON(datos, `reporte_${tipoReporte}`);
          break;
      }

      agregarAlHistorial(tipoReporte, formato);
      mostrarToast(
        `Reporte de ${reporte.nombre} generado exitosamente`,
        "success"
      );
    } catch (error) {
      console.error("Error generando reporte:", error);
      mostrarToast("Error al generar el reporte", "error");
    }
  }, 1500);
}

function obtenerDatosParaReporte(tipoReporte) {
  // Simular obtención de datos según el tipo de reporte
  const datosEjemplo = {
    tareas: [
      {
        id: 1,
        tarea: "Revisar documentación",
        estado: "Completada",
        asignado: "Juan Pérez",
        fecha: "2024-01-15",
      },
      {
        id: 2,
        tarea: "Preparar embarque",
        estado: "En progreso",
        asignado: "María García",
        fecha: "2024-01-16",
      },
    ],
    embarques: [
      {
        id: "BV-2025-0382",
        buque: "Pacific Star",
        origen: "Shanghái",
        destino: "Buenaventura",
        estado: "En tránsito",
      },
    ],
    facturacion: [
      {
        id: "FAC-001",
        cliente: "Empresa ABC",
        monto: 15000,
        estado: "Pagada",
        fecha: "2024-01-10",
      },
    ],
    personal: [
      {
        nombre: "Ana López",
        departamento: "Logística",
        puesto: "Coordinador",
        estado: "Activo",
      },
    ],
    estadisticas: [
      {
        metric: "Embarques Totales",
        valor: 158,
        tendencia: "+12%",
      },
    ],
    inventario: [
      {
        producto: "Contenedor 20ft",
        cantidad: 45,
        ubicacion: "Almacén A",
        estado: "Disponible",
      },
    ],
  };

  return datosEjemplo[tipoReporte] || [{ mensaje: "No hay datos disponibles" }];
}

function descargarCSV(datos, nombreArchivo) {
  if (!datos || datos.length === 0) {
    mostrarToast("No hay datos para exportar", "error");
    return;
  }

  const cabeceras = Object.keys(datos[0]);
  const filasCSV = datos.map((fila) =>
    cabeceras
      .map((header) => {
        const valor = fila[header];
        return typeof valor === "string" && valor.includes(",")
          ? `"${valor}"`
          : valor;
      })
      .join(",")
  );

  const csvContent = [cabeceras.join(","), ...filasCSV].join("\n");
  descargarArchivoGenerico(csvContent, `${nombreArchivo}.csv`, "text/csv");
}

function exportarExcel(datos, nombreArchivo) {
  mostrarToast(`Exportando ${nombreArchivo} a Excel...`, "info");
  // En una implementación real, aquí usarías una librería como SheetJS
  descargarCSV(datos, nombreArchivo); // Fallback a CSV por ahora
}

function exportarPDF(datos, nombreArchivo) {
  mostrarToast(`Exportando ${nombreArchivo} a PDF...`, "info");
  // En una implementación real, aquí usarías una librería como jsPDF
  exportarJSON(datos, nombreArchivo); // Fallback a JSON por ahora
}

function exportarJSON(datos, nombreArchivo) {
  const jsonContent = JSON.stringify(datos, null, 2);
  descargarArchivoGenerico(
    jsonContent,
    `${nombreArchivo}.json`,
    "application/json"
  );
}

function descargarArchivoGenerico(contenido, nombreArchivo, tipoMime) {
  const blob = new Blob([contenido], { type: `${tipoMime};charset=utf-8;` });
  const enlace = document.createElement("a");
  const url = URL.createObjectURL(blob);

  enlace.setAttribute("href", url);
  enlace.setAttribute("download", nombreArchivo);
  enlace.style.visibility = "hidden";

  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

function actualizarFormatosTarjetas(formato) {
  document.querySelectorAll(".formato-badge").forEach((span) => {
    span.textContent = formato.toUpperCase();
  });
}

function filtrarReportes(termino) {
  const grid = document.getElementById("grid-reportes");
  if (!grid) return;

  const tarjetas = grid.querySelectorAll(".reporte-card");
  const terminoLower = termino.toLowerCase();

  tarjetas.forEach((tarjeta) => {
    const nombre = tarjeta.querySelector("h3").textContent.toLowerCase();
    const descripcion = tarjeta.querySelector("p").textContent.toLowerCase();

    if (nombre.includes(terminoLower) || descripcion.includes(terminoLower)) {
      tarjeta.style.display = "block";
    } else {
      tarjeta.style.display = "none";
    }
  });
}

function exportarMultiple() {
  mostrarToast("Preparando exportación múltiple...", "info");
  // Lógica para exportación múltiple
}

function mostrarModalProgramacion() {
  mostrarToast("Abriendo programador de exportaciones...", "info");
  // Lógica para modal de programación
}

function aplicarConfiguracion() {
  const metadatos = document.getElementById("toggle-metadatos").checked;
  const comprimir = document.getElementById("toggle-comprimir").checked;
  const imagenes = document.getElementById("toggle-imagenes").checked;

  mostrarToast(
    `Configuración aplicada: Metadatos ${metadatos ? "ON" : "OFF"}, Comprimir ${
      comprimir ? "ON" : "OFF"
    }, Imágenes ${imagenes ? "ON" : "OFF"}`,
    "success"
  );
}

function actualizarHistorial() {
  mostrarToast("Actualizando historial...", "info");
  // Lógica para actualizar historial
}

function agregarAlHistorial(tipoReporte, formato) {
  console.log(
    `Reporte ${tipoReporte} en formato ${formato} agregado al historial`
  );
}

function descargarArchivo(archivo) {
  mostrarToast(`Descargando ${archivo}...`, "info");
}

function eliminarArchivo(archivo) {
  if (confirm(`¿Estás seguro de que quieres eliminar ${archivo}?`)) {
    mostrarToast(`Archivo ${archivo} eliminado`, "success");
  }
}

// Funciones para toast
function mostrarToast(mensaje, tipo = "info") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = mensaje;

  // Configurar el color según el tipo
  toast.className = "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50";
  if (tipo === "success") {
    toast.classList.add("bg-green-500", "text-white");
  } else if (tipo === "error") {
    toast.classList.add("bg-red-500", "text-white");
  } else if (tipo === "info") {
    toast.classList.add("bg-blue-500", "text-white");
  } else {
    toast.classList.add("bg-gray-500", "text-white");
  }

  // Mostrar el toast
  toast.classList.remove("hidden");

  // Ocultar automáticamente después de 3 segundos
  setTimeout(ocultarToast, 3000);
}

function ocultarToast() {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.add("hidden");
  }
}

// Configurar evento para cerrar toast
document.addEventListener("DOMContentLoaded", function () {
  const toastClose = document.getElementById("toast-close");
  if (toastClose) {
    toastClose.addEventListener("click", ocultarToast);
  }
});

// La inicialización se maneja automáticamente arriba
