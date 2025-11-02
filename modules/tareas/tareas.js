let tareas = [];
let flatpickrInstances = []; // Para almacenar instancias de Flatpickr

// Función de inicialización que se ejecutará cuando el módulo se cargue
function inicializarModulo() {
  console.log("Inicializando módulo...");
  // Mover el contenido de inicializar aquí

  renderizarTareas();
  configurarEventosGlobales();
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarModulo);
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  inicializarModulo();
}

function renderizarTareas() {
  const moduleContent = document.getElementById("module-content");
  if (!moduleContent) {
    console.error("No se encontró el module-content");
    return;
  }

  // Crear estructura completa del módulo
  moduleContent.innerHTML = crearEstructuraCompleta();

  // Renderizar los componentes después de crear la estructura
  setTimeout(() => {
    renderizarTablaTareas();
    actualizarEstadisticas();
    configurarEventosTabla();
  }, 100);
}

function crearEstructuraCompleta() {
  const tareasPendientes = tareas.filter((t) => t.estado === "pending").length;
  const tareasCompletadas = tareas.filter(
    (t) => t.estado === "completed"
  ).length;
  const eficiencia =
    tareas.length > 0
      ? Math.round((tareasCompletadas / tareas.length) * 100)
      : 0;
  const tareasAltaPrioridad = tareas.filter(
    (t) => t.prioridad === "high"
  ).length;

  // Calcular porcentajes con protección contra división por cero
  const porcentajePendientes =
    tareas.length > 0
      ? Math.round((tareasPendientes / tareas.length) * 100)
      : 0;
  const porcentajeAltaPrioridad =
    tareas.length > 0
      ? Math.round((tareasAltaPrioridad / tareas.length) * 100)
      : 0;
  //calcula el porcentaje de la semana pasada
  const eficienciaSemanaPasada = 72; // valor que guardas de la semana pasada
  const diferencia = eficiencia - eficienciaSemanaPasada;

  return `
    <div class="tareas-module">    
        <!-- Estadísticas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Tareas pendientes</p>
                        <h2 class="text-2xl font-bold">${tareasPendientes}</h2>
                    </div>
                    <div class="p-2 bg-blue-100 rounded-md text-blue-600">
                        <i class="fas fa-tasks"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="text-red-600"><i class="fas fa-arrow-up"></i> ${porcentajePendientes}%</span>
                    del total
                </div>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Eficiencia</p>
                        <h2 class="text-2xl font-bold">${eficiencia}%</h2>
                    </div>
                    <div class="p-2 bg-green-100 rounded-md text-green-600">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="text-green-600"><i class="fas fa-arrow-up"></i> ${diferencia}%</span>
                    desde la semana pasada
                </div>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-red-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Alta prioridad</p>
                        <h2 class="text-2xl font-bold">${tareasAltaPrioridad}</h2>
                    </div>
                    <div class="p-2 bg-red-100 rounded-md text-red-600">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="text-red-600"><i class="fas fa-arrow-up"></i> ${porcentajeAltaPrioridad}%</span>
                    requieren atención
                </div>
            </div>
        </div>

        <!-- Tabla de tareas -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="p-4 border-b border-gray-200">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex flex-1 items-center">
                        <div class="relative flex-1 max-w-md">
                            <input type="text" placeholder="Buscar tareas..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" id="buscar-tareas">
                            <div class="absolute left-3 top-2.5 text-gray-400"><i class="fas fa-search"></i></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-estado">
                                <option value="">Todos los estados</option>
                                <option value="pending">Pendiente</option>
                                <option value="in-progress">En Progreso</option>
                                <option value="completed">Completado</option>
                            </select>
                        </div>
                        <div>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-prioridad">
                                <option value="">Todas las prioridades</option>
                                <option value="high">Alta</option>
                                <option value="medium">Media</option>
                                <option value="low">Baja</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarea</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado a</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha límite</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tareas-table-body" class="bg-white divide-y divide-gray-200">
                        <!-- Las tareas se cargarán aquí dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Paneles inferiores -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-md p-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Tareas por Estado</h2>
                    <div class="text-sm text-gray-500">
                        <select class="border-none text-sm">
                            <option>Este Mes</option>
                            <option>Este Trimestre</option>
                            <option>Este Año</option>
                        </select>
                    </div>
                </div>
                <div class="space-y-4" id="estadisticas-estado">
                    <!-- Las estadísticas se cargarán dinámicamente -->
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Próximas Tareas</h2>
                    <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-800 text-sm">Ver todas</a>
                </div>
                <div class="space-y-3" id="proximas-tareas">
                    <!-- Las próximas tareas se cargarán dinámicamente -->
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderizarTablaTareas() {
  const tableBody = document.getElementById("tareas-table-body");
  if (!tableBody) {
    console.error("No se encontró el table body para tareas");
    return;
  }

  tableBody.innerHTML = tareas
    .map(
      (tarea) => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${escapeHtml(
                      tarea.titulo
                    )}</div>
                    <div class="text-sm text-gray-500">${escapeHtml(
                      tarea.descripcion
                    )}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full ${getColorIniciales(
                          tarea.asignado
                        )} flex items-center justify-center text-white font-medium text-sm">
                            ${getIniciales(tarea.asignado)}
                        </div>
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">${escapeHtml(
                              tarea.asignado
                            )}</div>
                            <div class="text-sm text-gray-500">${
                              tarea.departamento
                            }</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${tarea.fecha}</div>
                    <div class="text-xs text-gray-500">${calcularDiasRestantes(
                      tarea.fecha
                    )}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        ${tarea.departamento}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${getBadgePrioridad(tarea.prioridad)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge status-${
                      tarea.estado
                    } border">${getEstadoText(tarea.estado)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-800 mr-3 edit-btn" data-id="${
                      tarea.id
                    }">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800 delete-btn" data-id="${
                      tarea.id
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    )
    .join("");
}

function actualizarEstadisticas() {
  actualizarEstadisticasEstado();
  actualizarProximasTareas();
}

function actualizarEstadisticasEstado() {
  const container = document.getElementById("estadisticas-estado");
  if (!container) return;

  const estados = {
    "in-progress": {
      nombre: "En progreso",
      color: "blue",
      cantidad: tareas.filter((t) => t.estado === "in-progress").length,
    },
    completed: {
      nombre: "Completadas",
      color: "green",
      cantidad: tareas.filter((t) => t.estado === "completed").length,
    },
    pending: {
      nombre: "Pendientes",
      color: "yellow",
      cantidad: tareas.filter((t) => t.estado === "pending").length,
    },
  };

  const total = tareas.length;

  container.innerHTML = Object.values(estados)
    .map(
      (estado) => `
            <div>
                <div class="flex justify-between text-sm mb-1">
                    <span class="flex items-center">
                        <span class="w-3 h-3 bg-${
                          estado.color
                        }-500 rounded-full mr-2"></span>
                        ${estado.nombre}
                    </span>
                    <span>${estado.cantidad} tareas</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-${
                      estado.color
                    }-500 h-2 rounded-full" style="width: ${
        total > 0 ? (estado.cantidad / total) * 100 : 0
      }%"></div>
                </div>
            </div>
        `
    )
    .join("");
}

function actualizarProximasTareas() {
  const container = document.getElementById("proximas-tareas");
  if (!container) return;

  const proximas = tareas
    .filter((t) => t.estado === "pending" || t.estado === "in-progress")
    .slice(0, 4);

  container.innerHTML = proximas
    .map(
      (tarea) => `
            <div class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div class="h-10 w-10 rounded-full ${getColorPrioridad(
                  tarea.prioridad
                )} flex items-center justify-center text-white mr-3">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-sm font-medium">${escapeHtml(
                      tarea.titulo
                    )}</h3>
                    <p class="text-xs text-gray-500">${tarea.fecha} - ${
        tarea.asignado
      }</p>
                </div>
                <span class="status-badge status-${
                  tarea.estado
                } border">${getEstadoText(tarea.estado)}</span>
            </div>
        `
    )
    .join("");
}

function configurarEventosGlobales() {
  // Configurar eventos del modal
  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modal-close");
  const modalCancel = document.getElementById("modal-cancel");

  if (modalClose) {
    modalClose.addEventListener("click", ocultarModal);
  }

  if (modalCancel) {
    modalCancel.addEventListener("click", ocultarModal);
  }

  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        ocultarModal();
      }
    });
  }

  // Configurar toast
  const toastClose = document.getElementById("toast-close");
  if (toastClose) {
    toastClose.addEventListener("click", ocultarToast);
  }

  // Usar event delegation para el botón de nueva tarea
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "btn-nueva-tarea" ||
      e.target.closest("#btn-nueva-tarea")
    ) {
      mostrarModalCrear();
    }
  });
}

function configurarEventosTabla() {
  const tableBody = document.getElementById("tareas-table-body");
  if (!tableBody) return;

  // Usar event delegation para los botones de editar y eliminar
  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    const editBtn = target.closest(".edit-btn");
    const deleteBtn = target.closest(".delete-btn");

    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      mostrarModalEditar(id);
    }

    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      eliminarTarea(id);
    }
  });

  // Configurar filtros
  const filtroEstado = document.getElementById("filtro-estado");
  const filtroPrioridad = document.getElementById("filtro-prioridad");
  const buscarTareas = document.getElementById("buscar-tareas");

  if (filtroEstado) {
    filtroEstado.addEventListener("change", aplicarFiltros);
  }
  if (filtroPrioridad) {
    filtroPrioridad.addEventListener("change", aplicarFiltros);
  }
  if (buscarTareas) {
    buscarTareas.addEventListener("input", aplicarFiltros);
  }
}

function aplicarFiltros() {
  const filtroEstado = document.getElementById("filtro-estado")?.value;
  const filtroPrioridad = document.getElementById("filtro-prioridad")?.value;
  const textoBusqueda = document
    .getElementById("buscar-tareas")
    ?.value.toLowerCase();

  let tareasFiltradas = tareas;

  if (filtroEstado) {
    tareasFiltradas = tareasFiltradas.filter((t) => t.estado === filtroEstado);
  }

  if (filtroPrioridad) {
    tareasFiltradas = tareasFiltradas.filter(
      (t) => t.prioridad === filtroPrioridad
    );
  }

  if (textoBusqueda) {
    tareasFiltradas = tareasFiltradas.filter(
      (t) =>
        t.titulo.toLowerCase().includes(textoBusqueda) ||
        t.descripcion.toLowerCase().includes(textoBusqueda) ||
        t.asignado.toLowerCase().includes(textoBusqueda) ||
        t.departamento.toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarTablaFiltrada(tareasFiltradas);
}

function renderizarTablaFiltrada(tareasFiltradas) {
  const tableBody = document.getElementById("tareas-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = tareasFiltradas
    .map((tarea) => renderFilaTarea(tarea))
    .join("");
}

function renderFilaTarea(tarea) {
  return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${escapeHtml(
                  tarea.titulo
                )}</div>
                <div class="text-sm text-gray-500">${escapeHtml(
                  tarea.descripcion
                )}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full ${getColorIniciales(
                      tarea.asignado
                    )} flex items-center justify-center text-white font-medium text-sm">
                        ${getIniciales(tarea.asignado)}
                    </div>
                    <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">${escapeHtml(
                          tarea.asignado
                        )}</div>
                        <div class="text-sm text-gray-500">${
                          tarea.departamento
                        }</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${tarea.fecha}</div>
                <div class="text-xs text-gray-500">${calcularDiasRestantes(
                  tarea.fecha
                )}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    ${tarea.departamento}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getBadgePrioridad(tarea.prioridad)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-${
                  tarea.estado
                } border">${getEstadoText(tarea.estado)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-800 mr-3 edit-btn" data-id="${
                  tarea.id
                }">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800 delete-btn" data-id="${
                  tarea.id
                }">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// Funciones auxiliares
function calcularDiasRestantes(fecha) {
  const hoy = new Date();
  const fechaLimite = new Date(fecha.split("/").reverse().join("-"));
  const diffTime = fechaLimite - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays > 1) return `En ${diffDays} días`;
  if (diffDays === -1) return "Ayer";
  return `Hace ${Math.abs(diffDays)} días`;
}

function getBadgePrioridad(prioridad) {
  const badges = {
    high: '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><i class="fas fa-exclamation-triangle mr-1"></i>Alta</span>',
    medium:
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i class="fas fa-exclamation-circle mr-1"></i>Media</span>',
    low: '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-info-circle mr-1"></i>Baja</span>',
  };
  return (
    badges[prioridad] ||
    '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Desconocida</span>'
  );
}

function getColorPrioridad(prioridad) {
  const colores = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };
  return colores[prioridad] || "bg-gray-500";
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getColorIniciales(nombre) {
  const colores = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
  ];
  const index = nombre.charCodeAt(0) % colores.length;
  return colores[index];
}

function getIniciales(nombre) {
  if (!nombre) return "??";
  return nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getEstadoText(estado) {
  const estados = {
    pending: "Pendiente",
    "in-progress": "En progreso",
    completed: "Completado",
  };
  return estados[estado] || estado;
}

// Funciones para el modal
function mostrarModal(titulo, contenido, callbackConfirmar) {
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalSave = document.getElementById("modal-save");
  const modal = document.getElementById("modal");

  if (!modal || !modalTitle || !modalBody || !modalSave) {
    console.error("Elementos del modal no encontrados");
    return;
  }

  modalTitle.textContent = titulo;
  modalBody.innerHTML = contenido;
  modalSave.onclick = callbackConfirmar;
  modal.classList.remove("hidden");

  // ELIMINAR esta línea:
  // setTimeout(inicializarFlatpickrEnModal, 100);
}

function ocultarModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function mostrarModalCrear() {
  const campos = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input type="text" id="create-titulo" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea id="create-descripcion" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3"></textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Asignado a *</label>
                <select id="create-asignado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="">Seleccionar...</option>
                    <option value="Carlos Martínez">Carlos Martínez</option>
                    <option value="María López">María López</option>
                    <option value="Juan Pérez">Juan Pérez</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha límite *</label>
    <input 
        type="date" 
        id="create-fecha" 
        class="w-full px-3 py-2 border border-gray-300 rounded-md" 
        required>
                <div class="text-xs text-gray-500 mt-1">Haz clic para seleccionar una fecha</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad *</label>
                    <select id="create-prioridad" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="create-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="pending">Pendiente</option>
                        <option value="in-progress">En Progreso</option>
                        <option value="completed">Completado</option>
                    </select>
                </div>
            </div>
        </div>
    `;

  mostrarModal("Nueva Tarea", campos, crearTarea);
}

function mostrarModalEditar(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;

  const campos = `
        <div class="space-y-4">
            <input type="hidden" id="edit-id" value="${tarea.id}">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input type="text" id="edit-titulo" value="${escapeHtml(
                  tarea.titulo
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea id="edit-descripcion" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3">${escapeHtml(
                  tarea.descripcion
                )}</textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Asignado a *</label>
                <select id="edit-asignado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="Carlos Martínez" ${
                      tarea.asignado === "Carlos Martínez" ? "selected" : ""
                    }>Carlos Martínez</option>
                    <option value="María López" ${
                      tarea.asignado === "María López" ? "selected" : ""
                    }>María López</option>
                    <option value="Juan Pérez" ${
                      tarea.asignado === "Juan Pérez" ? "selected" : ""
                    }>Juan Pérez</option>
                </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha límite *</label>
              <input type="date" id="edit-fecha" 
              value="${tarea.fecha.split("/").reverse().join("-")}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md" 
              required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad *</label>
                    <select id="edit-prioridad" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="low" ${
                          tarea.prioridad === "low" ? "selected" : ""
                        }>Baja</option>
                        <option value="medium" ${
                          tarea.prioridad === "medium" ? "selected" : ""
                        }>Media</option>
                        <option value="high" ${
                          tarea.prioridad === "high" ? "selected" : ""
                        }>Alta</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="edit-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="pending" ${
                          tarea.estado === "pending" ? "selected" : ""
                        }>Pendiente</option>
                        <option value="in-progress" ${
                          tarea.estado === "in-progress" ? "selected" : ""
                        }>En Progreso</option>
                        <option value="completed" ${
                          tarea.estado === "completed" ? "selected" : ""
                        }>Completado</option>
                    </select>
                </div>
            </div>
        </div>
    `;

  mostrarModal("Editar Tarea", campos, editarTarea);
}

function crearTarea() {
  const titulo = document.getElementById("create-titulo")?.value.trim();
  const asignado = document.getElementById("create-asignado")?.value;
  const fechaInput = document.getElementById("create-fecha")?.value; // yyyy-mm-dd

  if (!titulo || !asignado || !fechaInput) {
    mostrarToast("Por favor complete todos los campos obligatorios", "error");
    return;
  }

  // CONVERTIR de yyyy-mm-dd a dd/mm/yyyy
  const fechaParts = fechaInput.split("-");
  const fecha = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;

  const nuevaTarea = {
    id: Date.now(),
    titulo: titulo,
    descripcion:
      document.getElementById("create-descripcion")?.value.trim() || "",
    asignado: asignado,
    fecha: fecha, // ← Usar la fecha convertida
    prioridad: document.getElementById("create-prioridad")?.value || "medium",
    estado: document.getElementById("create-estado")?.value || "pending",
    departamento: asignarDepartamento(asignado),
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  renderizarTareas();
  ocultarModal();
  mostrarToast("¡Tarea creada con éxito!");
}

function editarTarea() {
  const id = parseInt(document.getElementById("edit-id")?.value);
  const tareaIndex = tareas.findIndex((t) => t.id === id);

  if (tareaIndex !== -1) {
    tareas[tareaIndex] = {
      ...tareas[tareaIndex],
      titulo: document.getElementById("edit-titulo")?.value.trim() || "",
      descripcion:
        document.getElementById("edit-descripcion")?.value.trim() || "",
      asignado: document.getElementById("edit-asignado")?.value || "",
      fecha: document.getElementById("edit-fecha")?.value || "",
      prioridad: document.getElementById("edit-prioridad")?.value || "medium",
      estado: document.getElementById("edit-estado")?.value || "pending",
      departamento: asignarDepartamento(
        document.getElementById("edit-asignado")?.value
      ),
    };

    guardarTareas();
    renderizarTareas();
    ocultarModal();
    mostrarToast("¡Tarea actualizada con éxito!");
  }
}

function eliminarTarea(id) {
  if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
    tareas = tareas.filter((t) => t.id !== id);
    guardarTareas();
    renderizarTareas();
    mostrarToast("¡Tarea eliminada con éxito!");
  }
}

function guardarTareas() {
  // Los datos se mantienen en el arreglo tareas en memoria
  // No se usa localStorage, los datos persisten durante la sesión
  console.log("Tareas guardadas en memoria:", tareas.length, "elementos");
}

function asignarDepartamento(asignado) {
  const departamentos = {
    "Carlos Martínez": "Logística",
    "María López": "Gestión de Documentos",
    "Juan Pérez": "Mantenimiento",
  };
  return departamentos[asignado] || "Operaciones Portuarias";
}

// Funciones para toast
function mostrarToast(mensaje, tipo = "success") {
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

// La inicialización se maneja automáticamente arriba
