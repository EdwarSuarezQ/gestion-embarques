import ApiService from "../../assets/JS/utils/apiService.js";

const api = new ApiService();
let tiposReporte = [];

// Función de inicialización
async function inicializarModulo() {
  console.log("Inicializando módulo de exportación...");
  await cargarTiposReporte();
  renderizarInterfaz();
  configurarEventos();
}

async function cargarTiposReporte() {
  try {
    const res = await api.get("/export/tipos");
    tiposReporte = res.data || [];
  } catch (err) {
    console.error("Error cargando tipos de reporte:", err);
    // Usar tipos completos si falla la API
    tiposReporte = [
      {
        id: "embarques",
        nombre: "Reporte de Embarques",
        descripcion: "Detalles de todos los embarques y su estado actual.",
        icono: "ship",
        color: "blue",
      },
      {
        id: "tareas",
        nombre: "Reporte de Tareas",
        descripcion: "Tareas pendientes, en progreso y completadas.",
        icono: "tasks",
        color: "green",
      },
      {
        id: "rutas",
        nombre: "Reporte de Rutas",
        descripcion: "Rutas de transporte y logística.",
        icono: "route",
        color: "purple",
      },
      {
        id: "facturas",
        nombre: "Reporte de Facturas",
        descripcion: "Facturas emitidas y estado de pago.",
        icono: "file-invoice-dollar",
        color: "orange",
      },
      {
        id: "personal",
        nombre: "Reporte de Personal",
        descripcion: "Información del personal y asignaciones.",
        icono: "users",
        color: "red",
      },
      {
        id: "embarcaciones",
        nombre: "Reporte de Embarcaciones",
        descripcion: "Flota de embarcaciones y estado técnico.",
        icono: "anchor",
        color: "indigo",
      },
      {
        id: "almacenes",
        nombre: "Reporte de Almacenes",
        descripcion: "Inventario y estado de almacenes.",
        icono: "warehouse",
        color: "yellow",
      },
    ];
    mostrarToast("Usando tipos de reporte predefinidos", "info");
  }
}

// Auto-inicialización
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarModulo);
} else {
  inicializarModulo();
}

function renderizarInterfaz() {
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
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Exportar Datos del Sistema</h1>
        <p class="text-gray-600">Genera reportes de todos los módulos del sistema</p>
      </div>

      <!-- Configuración -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4 flex-1">
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
                <option value="txt">Texto</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2" id="btn-exportar-todos">
              <i class="fas fa-download"></i> Exportar Todo
            </button>
          </div>
        </div>
      </div>

      <!-- Grid de reportes - AHORA CON 7 MÓDULOS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6" id="grid-reportes">
        ${tiposReporte.map((reporte) => crearTarjetaReporte(reporte)).join("")}
      </div>

      <!-- Panel de filtros -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Filtros de Exportación</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" id="filtro-fecha-desde">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" id="filtro-fecha-hasta">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md" id="filtro-estado">
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En Progreso</option>
            </select>
          </div>
        </div>
      </div>
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
        <span class="text-xs text-gray-500">Módulo del sistema</span>
        <button class="text-${reporte.color}-600 hover:text-${reporte.color}-800 text-sm font-medium exportar-btn" data-reporte="${reporte.id}">
          Exportar <i class="fas fa-arrow-down ml-1"></i>
        </button>
      </div>
    </div>
  `;
}

function configurarEventos() {
  console.log("Configurando eventos del módulo de exportación...");

  // Eventos para exportar reportes individuales
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

  // Exportar todos los reportes
  document
    .getElementById("btn-exportar-todos")
    ?.addEventListener("click", exportarTodos);

  // Cambio de formato
  const formatoSelect = document.getElementById("formato-exportacion");
  if (formatoSelect) {
    formatoSelect.addEventListener("change", function (e) {
      actualizarFormatosTarjetas(e.target.value);
    });
  }

  // Búsqueda de reportes
  const buscarInput = document.getElementById("buscar-reporte");
  if (buscarInput) {
    buscarInput.addEventListener("input", function (e) {
      filtrarReportes(e.target.value);
    });
  }
}

async function generarReporte(tipoReporte) {
  const formato =
    document.getElementById("formato-exportacion")?.value || "csv";
  const reporte = tiposReporte.find((r) => r.id === tipoReporte);

  if (!reporte) {
    mostrarToast("Tipo de reporte no encontrado", "error");
    return;
  }

  mostrarToast(
    `Generando reporte de ${reporte.nombre} en ${formato.toUpperCase()}...`,
    "info"
  );

  try {
    const filtros = {
      fechaDesde: document.getElementById("filtro-fecha-desde")?.value,
      fechaHasta: document.getElementById("filtro-fecha-hasta")?.value,
      estado: document.getElementById("filtro-estado")?.value,
    };

    // SOLUCIÓN CON AXIOS: Configurar para obtener respuesta completa
    const response = await api.post(
      "/export/generar",
      {
        tipo: tipoReporte,
        formato,
        filtros,
      },
      {
        responseType: "blob",
        transformResponse: [(data) => data], // Importante para no procesar el blob
      }
    );

    // Crear nombre de archivo sin depender de headers
    const extensiones = {
      csv: "csv",
      excel: "xlsx",
      pdf: "pdf",
      json: "json",
      txt: "txt",
    };

    const filename = `reporte_${tipoReporte}_${Date.now()}.${
      extensiones[formato] || formato
    }`;

    // Crear URL del blob y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    mostrarToast(
      `Reporte ${reporte.nombre} descargado correctamente`,
      "success"
    );
  } catch (err) {
    console.error("Error generando reporte:", err);

    // Manejar errores específicos
    if (err.response && err.response.status === 400) {
      mostrarToast("Formato o tipo de reporte no válido", "error");
    } else if (err.response && err.response.status === 500) {
      mostrarToast("Error interno del servidor al generar el reporte", "error");
    } else {
      mostrarToast("Error al generar el reporte", "error");
    }
  }
}

async function exportarTodos() {
  if (
    !confirm(
      "¿Estás seguro de que quieres exportar todos los reportes? Esto puede tomar unos momentos."
    )
  ) {
    return;
  }

  mostrarToast("Exportando todos los reportes...", "info");

  let exportados = 0;
  const total = tiposReporte.length;

  for (const reporte of tiposReporte) {
    try {
      await generarReporte(reporte.id);
      exportados++;
      // Pausa más larga entre reportes para evitar sobrecarga
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error exportando ${reporte.nombre}:`, error);
    }
  }

  if (exportados === total) {
    mostrarToast(
      `Todos los ${exportados} reportes exportados correctamente`,
      "success"
    );
  } else {
    mostrarToast(
      `Se exportaron ${exportados} de ${total} reportes`,
      exportados > 0 ? "warning" : "error"
    );
  }
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

// Funciones para toast (mantener igual)
function mostrarToast(mensaje, tipo = "info") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = mensaje;

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

  toast.classList.remove("hidden");
  setTimeout(ocultarToast, 3000);
}

function ocultarToast() {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const toastClose = document.getElementById("toast-close");
  if (toastClose) {
    toastClose.addEventListener("click", ocultarToast);
  }
});
