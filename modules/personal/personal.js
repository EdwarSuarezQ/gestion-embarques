import ApiService from "../../assets/JS/utils/apiService.js";

const api = new ApiService();
let personal = [];

// Función para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function inicializar() {
  configurarEventosGlobales();
  await cargarPersonal();
}

async function cargarPersonal() {
  try {
    const res = await api.get("/personal");
    const payload = res && res.data ? res.data : res;
    if (payload && Array.isArray(payload.items))
      personal = payload.items.map(mapServerPersonal);
    else if (Array.isArray(payload)) personal = payload.map(mapServerPersonal);
    else personal = [];
    renderizarPersonal();
    actualizarTodo();
  } catch (err) {
    console.error("Error cargando personal", err);
  }
}

function mapServerPersonal(p) {
  if (!p) return p;
  const copy = Object.assign({}, p);
  if (!copy.id && copy._id) copy.id = copy._id;
  return copy;
}

function renderizarPersonal() {
  const moduleContent = document.getElementById("module-content");
  if (!moduleContent) {
    console.error("No se encontró el module-content");
    return;
  }

  // Crear estructura completa del módulo
  moduleContent.innerHTML = crearEstructuraCompleta();

  // Renderizar los componentes después de crear la estructura
  setTimeout(() => {
    renderizarTablaPersonal();
    actualizarTodo();
    configurarEventosTabla();
  }, 100);
}

function crearEstructuraCompleta() {
  const stats = calcularEstadisticas();
  const total = personal.length;
  const porcentajeActivos =
    total > 0 ? Math.round((stats.activos / total) * 100) : 0;
  const variacionPersonal = calcularVariacionPersonal();

  return `
    <div class="personal-module">
        <!-- Estadísticas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Total empleados</p>
                        <h2 class="text-2xl font-bold">${total}</h2>
                    </div>
                    <div class="p-2 bg-blue-100 rounded-md text-blue-600">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="${
                      variacionPersonal >= 0 ? "text-green-600" : "text-red-600"
                    }">
                        <i class="fas ${
                          variacionPersonal >= 0
                            ? "fa-arrow-up"
                            : "fa-arrow-down"
                        }"></i> ${Math.abs(variacionPersonal)}%
                    </span>
                    vs. trimestre anterior
                </div>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Empleados activos</p>
                        <h2 class="text-2xl font-bold">${stats.activos}</h2>
                    </div>
                    <div class="p-2 bg-green-100 rounded-md text-green-600">
                        <i class="fas fa-user-check"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="${
                      porcentajeActivos > 80
                        ? "text-green-600"
                        : "text-yellow-600"
                    }">
                        <i class="fas ${
                          porcentajeActivos > 80
                            ? "fa-arrow-up"
                            : "fa-arrow-down"
                        }"></i> ${porcentajeActivos}%
                    </span>
                    tasa de actividad
                </div>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Departamentos</p>
                        <h2 class="text-2xl font-bold">${
                          stats.departamentos
                        }</h2>
                    </div>
                    <div class="p-2 bg-purple-100 rounded-md text-purple-600">
                        <i class="fas fa-building"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="text-blue-600">
                        <i class="fas fa-chart-bar"></i> ${
                          stats.promedioPorDepto
                        }
                    </span>
                    promedio por depto
                </div>
            </div>
        </div>

        <!-- Tabla de personal -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="p-4 border-b border-gray-200">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex flex-1 items-center">
                        <div class="relative flex-1 max-w-md">
                            <input type="text" placeholder="Buscar personal..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" id="buscar-personal">
                            <div class="absolute left-3 top-2.5 text-gray-400"><i class="fas fa-search"></i></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-departamento">
                                <option value="">Todos los departamentos</option>
                                ${generarOpcionesDepartamentos()}
                            </select>
                        </div>
                        <div>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-estado">
                                <option value="">Todos los estados</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="personal-table-body" class="bg-white divide-y divide-gray-200">
                        <!-- Las filas se renderizan dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Paneles inferiores -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-md p-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Personal por Departamento</h2>
                    <div class="text-sm text-gray-500">
                        <select class="border-none text-sm">
                            <option>Este Año</option>
                            <option>Últimos 6 meses</option>
                            <option>Total</option>
                        </select>
                    </div>
                </div>
                <div class="space-y-4" id="estadisticas-departamentos">
                    <!-- Las estadísticas se cargarán dinámicamente -->
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Nuevos Ingresos</h2>
                    <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-800 text-sm">Ver todos</a>
                </div>
                <div class="space-y-3" id="nuevos-ingresos">
                    <!-- Los nuevos ingresos se cargarán dinámicamente -->
                </div>
            </div>
        </div>
    </div>
    `;
}

function calcularEstadisticas() {
  const activos = personal.filter((p) => p.estado === "active").length;
  const departamentos = [...new Set(personal.map((p) => p.departamento))]
    .length;
  const promedioPorDepto =
    personal.length > 0 ? Math.round(personal.length / departamentos) : 0;

  return {
    activos,
    departamentos,
    promedioPorDepto,
    total: personal.length,
  };
}

function calcularVariacionPersonal() {
  const personalActual = personal.length;
  // Simular datos del trimestre anterior (90% del actual)
  const personalAnterior = Math.round(personalActual * 0.9);

  if (personalAnterior === 0) return 0;
  return Math.round(
    ((personalActual - personalAnterior) / personalAnterior) * 100
  );
}

function actualizarTodo() {
  actualizarEstadisticasDepartamentos();
  actualizarNuevosIngresos();
  actualizarTarjetasEstadisticas();
}

function actualizarTarjetasEstadisticas() {
  const stats = calcularEstadisticas();
  const total = personal.length;
  const porcentajeActivos =
    total > 0 ? Math.round((stats.activos / total) * 100) : 0;
  const variacionPersonal = calcularVariacionPersonal();

  // Actualizar tarjeta de total empleados
  const tarjetaTotal = document.querySelector(
    ".bg-white.border-l-4.border-blue-500"
  );
  if (tarjetaTotal) {
    tarjetaTotal.querySelector("h2").textContent = total;
    const porcentajeElement = tarjetaTotal.querySelector(".text-sm span");
    porcentajeElement.className = `${
      variacionPersonal >= 0 ? "text-green-600" : "text-red-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      variacionPersonal >= 0 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${Math.abs(variacionPersonal)}% vs. trimestre anterior`;
  }

  // Actualizar tarjeta de empleados activos
  const tarjetaActivos = document.querySelector(
    ".bg-white.border-l-4.border-green-500"
  );
  if (tarjetaActivos) {
    tarjetaActivos.querySelector("h2").textContent = stats.activos;
    const porcentajeElement = tarjetaActivos.querySelector(".text-sm span");
    porcentajeElement.className = `${
      porcentajeActivos > 80 ? "text-green-600" : "text-yellow-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      porcentajeActivos > 80 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${porcentajeActivos}% tasa de actividad`;
  }

  // Actualizar tarjeta de departamentos
  const tarjetaDeptos = document.querySelector(
    ".bg-white.border-l-4.border-purple-500"
  );
  if (tarjetaDeptos) {
    tarjetaDeptos.querySelector("h2").textContent = stats.departamentos;
    const porcentajeElement = tarjetaDeptos.querySelector(".text-sm span");
    porcentajeElement.innerHTML = `<i class="fas fa-chart-bar"></i> ${stats.promedioPorDepto} promedio por depto`;
  }
}

function renderizarTablaPersonal() {
  const tableBody = document.getElementById("personal-table-body");
  if (!tableBody) {
    console.error("No se encontró personal-table-body");
    return;
  }

  tableBody.innerHTML = personal
    .map((persona) => renderFilaPersonal(persona))
    .join("");
}

function renderFilaPersonal(persona) {
  const iniciales = getIniciales(persona.nombre);
  return `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-full ${getColorIniciales(
            persona.nombre
          )} flex items-center justify-center text-white font-semibold">
            ${iniciales}
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${escapeHtml(
              persona.nombre
            )}</div>
            <div class="text-sm text-gray-500">${escapeHtml(
              persona.email
            )}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${escapeHtml(persona.puesto)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${escapeHtml(
          persona.departamento
        )}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="status-badge status-${
          persona.estado
        } border">${getEstadoText(persona.estado)}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button class="text-blue-600 hover:text-blue-800 mr-3 edit-personal-btn" data-id="${
          persona.id
        }">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-600 hover:text-red-800 delete-personal-btn" data-id="${
          persona.id
        }">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
}

function actualizarEstadisticasDepartamentos() {
  const container = document.getElementById("estadisticas-departamentos");
  if (!container) return;

  const departamentos = {
    Logística: {
      nombre: "Logística",
      color: "blue",
      cantidad: personal.filter((p) => p.departamento === "Logística").length,
    },
    "Gestión de Documentos": {
      nombre: "Gestión de Documentos",
      color: "green",
      cantidad: personal.filter(
        (p) => p.departamento === "Gestión de Documentos"
      ).length,
    },
    "Operaciones Portuarias": {
      nombre: "Operaciones Portuarias",
      color: "yellow",
      cantidad: personal.filter(
        (p) => p.departamento === "Operaciones Portuarias"
      ).length,
    },
    Mantenimiento: {
      nombre: "Mantenimiento",
      color: "purple",
      cantidad: personal.filter((p) => p.departamento === "Mantenimiento")
        .length,
    },
    Administración: {
      nombre: "Administración",
      color: "red",
      cantidad: personal.filter((p) => p.departamento === "Administración")
        .length,
    },
    "Recursos Humanos": {
      nombre: "Recursos Humanos",
      color: "pink",
      cantidad: personal.filter((p) => p.departamento === "Recursos Humanos")
        .length,
    },
    Finanzas: {
      nombre: "Finanzas",
      color: "indigo",
      cantidad: personal.filter((p) => p.departamento === "Finanzas").length,
    },
    "TI y Sistemas": {
      nombre: "TI y Sistemas",
      color: "teal",
      cantidad: personal.filter((p) => p.departamento === "TI y Sistemas")
        .length,
    },
    Seguridad: {
      nombre: "Seguridad",
      color: "gray",
      cantidad: personal.filter((p) => p.departamento === "Seguridad").length,
    },
    Calidad: {
      nombre: "Calidad",
      color: "orange",
      cantidad: personal.filter((p) => p.departamento === "Calidad").length,
    },
  };

  const total = personal.length;

  container.innerHTML = Object.values(departamentos)
    .map(
      (depto) => `
    <div>
      <div class="flex justify-between text-sm mb-1">
        <span class="flex items-center">
          <span class="w-3 h-3 bg-${depto.color}-500 rounded-full mr-2"></span>
          ${depto.nombre}
        </span>
        <span>${depto.cantidad} empleados</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-${depto.color}-500 h-2 rounded-full" style="width: ${
        total > 0 ? (depto.cantidad / total) * 100 : 0
      }%"></div>
      </div>
    </div>
  `
    )
    .join("");
}

function actualizarNuevosIngresos() {
  const container = document.getElementById("nuevos-ingresos");
  if (!container) return;

  const nuevos = personal
    .slice()
    .sort((a, b) => b.id - a.id) // Ordenar por ID descendente (más recientes primero)
    .slice(0, 4);

  container.innerHTML = nuevos
    .map(
      (persona) => `
      <div class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
        <div class="h-10 w-10 rounded-full ${getColorIniciales(
          persona.nombre
        )} flex items-center justify-center text-white font-semibold mr-3">
          ${getIniciales(persona.nombre)}
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium">${escapeHtml(persona.nombre)}</h3>
          <p class="text-xs text-gray-500">${escapeHtml(
            persona.puesto
          )} - ${escapeHtml(persona.departamento)}</p>
        </div>
        <span class="status-badge status-${
          persona.estado
        } border">${getEstadoText(persona.estado)}</span>
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

  // Usar event delegation para el botón de nuevo empleado
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "btn-nuevo-personal" ||
      e.target.closest("#btn-nuevo-personal")
    ) {
      mostrarModalCrear();
    }
  });
}

function configurarEventosTabla() {
  const tableBody = document.getElementById("personal-table-body");
  if (!tableBody) return;

  // Usar event delegation para los botones de editar y eliminar
  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    const editBtn = target.closest(".edit-personal-btn");
    const deleteBtn = target.closest(".delete-personal-btn");

    if (editBtn) {
      const id = editBtn.dataset.id;
      mostrarModalEditar(id);
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      eliminarPersonal(id);
    }
  });

  // Configurar filtros
  const filtroDepartamento = document.getElementById("filtro-departamento");
  const filtroEstado = document.getElementById("filtro-estado");
  const buscarPersonal = document.getElementById("buscar-personal");

  if (filtroDepartamento) {
    filtroDepartamento.addEventListener("change", aplicarFiltros);
  }
  if (filtroEstado) {
    filtroEstado.addEventListener("change", aplicarFiltros);
  }
  if (buscarPersonal) {
    buscarPersonal.addEventListener("input", aplicarFiltros);
  }
}

function aplicarFiltros() {
  const filtroDepartamento = document.getElementById(
    "filtro-departamento"
  )?.value;
  const filtroEstado = document.getElementById("filtro-estado")?.value;
  const textoBusqueda = document
    .getElementById("buscar-personal")
    ?.value.toLowerCase();

  let personalFiltrado = personal;

  if (filtroDepartamento) {
    personalFiltrado = personalFiltrado.filter(
      (p) =>
        (p.departamento || "").toLowerCase() ===
        filtroDepartamento.toLowerCase()
    );
  }

  if (filtroEstado) {
    personalFiltrado = personalFiltrado.filter(
      (p) => (p.estado || "").toLowerCase() === filtroEstado.toLowerCase()
    );
  }

  if (textoBusqueda) {
    personalFiltrado = personalFiltrado.filter(
      (p) =>
        (p.nombre || "").toLowerCase().includes(textoBusqueda) ||
        (p.email || "").toLowerCase().includes(textoBusqueda) ||
        (p.puesto || "").toLowerCase().includes(textoBusqueda) ||
        (p.departamento || "").toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarTablaFiltrada(personalFiltrado);
}

function renderizarTablaFiltrada(personalFiltrado) {
  const tableBody = document.getElementById("personal-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = personalFiltrado
    .map((persona) => renderFilaPersonal(persona))
    .join("");
}

// Funciones auxiliares
function generarOpcionesDepartamentos() {
  const deps = [
    ...new Set(personal.map((p) => p.departamento).filter(Boolean)),
  ];
  const opcionesPredefinidas = [
    "Logística",
    "Gestión de Documentos",
    "Operaciones Portuarias",
    "Mantenimiento",
    "Administración",
    "Recursos Humanos",
    "Finanzas",
    "TI y Sistemas",
    "Seguridad",
    "Calidad",
  ];

  // Combinar departamentos existentes con opciones predefinidas
  const todosDepartamentos = [
    ...new Set([...deps, ...opcionesPredefinidas]),
  ].sort();

  return todosDepartamentos
    .map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`)
    .join("");
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getIniciales(nombre) {
  if (!nombre) return "??";
  return nombre
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase();
}

function getColorIniciales(nombre) {
  const colores = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
  ];
  const index =
    nombre && nombre.charCodeAt(0) ? nombre.charCodeAt(0) % colores.length : 0;
  return colores[index];
}

function getEstadoText(estado) {
  const map = { active: "Activo", inactive: "Inactivo" };
  return map[estado] || estado;
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" id="create-nombre" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" id="create-email" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Puesto *</label>
                <select id="create-puesto" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">Seleccionar puesto...</option>
                  <option value="Coordinador de Operaciones">Coordinador de Operaciones</option>
                  <option value="Especialista en Aduanas">Especialista en Aduanas</option>
                  <option value="Técnico de Mantenimiento">Técnico de Mantenimiento</option>
                  <option value="Supervisora de Almacén">Supervisora de Almacén</option>
                  <option value="Analista de Documentación">Analista de Documentación</option>
                  <option value="Gerente de Logística">Gerente de Logística</option>
                  <option value="Operador Portuario">Operador Portuario</option>
                  <option value="Asistente Administrativo">Asistente Administrativo</option>
                  <option value="Jefe de Turno">Jefe de Turno</option>
                  <option value="Inspector de Calidad">Inspector de Calidad</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                <select id="create-departamento" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">Seleccionar departamento...</option>
                  <option value="Logística">Logística</option>
                  <option value="Gestión de Documentos">Gestión de Documentos</option>
                  <option value="Operaciones Portuarias">Operaciones Portuarias</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Administración">Administración</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="TI y Sistemas">TI y Sistemas</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Calidad">Calidad</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <select id="create-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
            </div>
        </div>
    `;

  mostrarModal("Nuevo Empleado", campos, crearPersonal);
}

// ========================
// CRUD de Personal - FUNCIONES CORREGIDAS
// ========================

// Crear nuevo personal - FUNCIÓN CORREGIDA
async function crearPersonal() {
  const nombre = document.getElementById("create-nombre").value.trim();
  const email = document.getElementById("create-email").value.trim();
  const puesto = document.getElementById("create-puesto").value;
  const departamento = document.getElementById("create-departamento").value;

  // Validaciones
  if (!nombre || !email || !puesto || !departamento) {
    mostrarToast("Por favor, completa todos los campos obligatorios.", "error");
    return;
  }

  // Validar formato de email
  if (!validarEmail(email)) {
    mostrarToast(
      "Por favor ingresa un email válido (ejemplo: usuario@dominio.com)",
      "error"
    );
    return;
  }

  try {
    const payload = {
      nombre,
      email: email.toLowerCase(), // Convertir a minúsculas
      puesto,
      departamento,
      estado: "active",
    };

    console.log("Enviando datos:", payload); // Para debug

    const res = await api.post("/personal", payload);
    const created = res && res.data ? res.data : res;
    personal.push(mapServerPersonal(created));

    renderizarTablaPersonal();
    actualizarTodo();
    ocultarModal();
    mostrarToast("Empleado agregado con éxito.", "success");
  } catch (err) {
    console.error("Error creando personal", err);

    // Mostrar mensaje de error más específico
    if (err.message && err.message.includes("email")) {
      mostrarToast("El email ingresado no es válido o ya existe", "error");
    } else {
      mostrarToast("Error al crear empleado.", "error");
    }
  }
}

// Mostrar modal de edición
function mostrarModalEditar(id) {
  const persona = personal.find((p) => String(p.id) === String(id));
  if (!persona) return;

  const campos = `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input type="text" id="edit-nombre" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${escapeHtml(
          persona.nombre
        )}" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" id="edit-email" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="${escapeHtml(
          persona.email
        )}" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Puesto *</label>
        <select id="edit-puesto" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
          <option value="">Seleccionar puesto...</option>
          <option value="Coordinador de Operaciones" ${
            persona.puesto === "Coordinador de Operaciones" ? "selected" : ""
          }>Coordinador de Operaciones</option>
          <option value="Especialista en Aduanas" ${
            persona.puesto === "Especialista en Aduanas" ? "selected" : ""
          }>Especialista en Aduanas</option>
          <option value="Técnico de Mantenimiento" ${
            persona.puesto === "Técnico de Mantenimiento" ? "selected" : ""
          }>Técnico de Mantenimiento</option>
          <option value="Supervisora de Almacén" ${
            persona.puesto === "Supervisora de Almacén" ? "selected" : ""
          }>Supervisora de Almacén</option>
          <option value="Analista de Documentación" ${
            persona.puesto === "Analista de Documentación" ? "selected" : ""
          }>Analista de Documentación</option>
          <option value="Gerente de Logística" ${
            persona.puesto === "Gerente de Logística" ? "selected" : ""
          }>Gerente de Logística</option>
          <option value="Operador Portuario" ${
            persona.puesto === "Operador Portuario" ? "selected" : ""
          }>Operador Portuario</option>
          <option value="Asistente Administrativo" ${
            persona.puesto === "Asistente Administrativo" ? "selected" : ""
          }>Asistente Administrativo</option>
          <option value="Jefe de Turno" ${
            persona.puesto === "Jefe de Turno" ? "selected" : ""
          }>Jefe de Turno</option>
          <option value="Inspector de Calidad" ${
            persona.puesto === "Inspector de Calidad" ? "selected" : ""
          }>Inspector de Calidad</option>
          ${
            persona.puesto &&
            ![
              "Coordinador de Operaciones",
              "Especialista en Aduanas",
              "Técnico de Mantenimiento",
              "Supervisora de Almacén",
              "Analista de Documentación",
              "Gerente de Logística",
              "Operador Portuario",
              "Asistente Administrativo",
              "Jefe de Turno",
              "Inspector de Calidad",
            ].includes(persona.puesto)
              ? `<option value="${persona.puesto}" selected>${persona.puesto}</option>`
              : ""
          }
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
        <select id="edit-departamento" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
          <option value="">Seleccionar departamento...</option>
          <option value="Logística" ${
            persona.departamento === "Logística" ? "selected" : ""
          }>Logística</option>
          <option value="Gestión de Documentos" ${
            persona.departamento === "Gestión de Documentos" ? "selected" : ""
          }>Gestión de Documentos</option>
          <option value="Operaciones Portuarias" ${
            persona.departamento === "Operaciones Portuarias" ? "selected" : ""
          }>Operaciones Portuarias</option>
          <option value="Mantenimiento" ${
            persona.departamento === "Mantenimiento" ? "selected" : ""
          }>Mantenimiento</option>
          <option value="Administración" ${
            persona.departamento === "Administración" ? "selected" : ""
          }>Administración</option>
          <option value="Recursos Humanos" ${
            persona.departamento === "Recursos Humanos" ? "selected" : ""
          }>Recursos Humanos</option>
          <option value="Finanzas" ${
            persona.departamento === "Finanzas" ? "selected" : ""
          }>Finanzas</option>
          <option value="TI y Sistemas" ${
            persona.departamento === "TI y Sistemas" ? "selected" : ""
          }>TI y Sistemas</option>
          <option value="Seguridad" ${
            persona.departamento === "Seguridad" ? "selected" : ""
          }>Seguridad</option>
          <option value="Calidad" ${
            persona.departamento === "Calidad" ? "selected" : ""
          }>Calidad</option>
          ${
            persona.departamento &&
            ![
              "Logística",
              "Gestión de Documentos",
              "Operaciones Portuarias",
              "Mantenimiento",
              "Administración",
              "Recursos Humanos",
              "Finanzas",
              "TI y Sistemas",
              "Seguridad",
              "Calidad",
            ].includes(persona.departamento)
              ? `<option value="${persona.departamento}" selected>${persona.departamento}</option>`
              : ""
          }
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
        <select id="edit-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
          <option value="active" ${
            persona.estado === "active" ? "selected" : ""
          }>Activo</option>
          <option value="inactive" ${
            persona.estado === "inactive" ? "selected" : ""
          }>Inactivo</option>
        </select>
      </div>
    </div>
  `;

  mostrarModal("Editar Empleado", campos, () => editarPersonal(id));
}

// Editar empleado - FUNCIÓN CORREGIDA
async function editarPersonal(id) {
  try {
    const personaLocal = personal.find((p) => String(p.id) === String(id));
    if (!personaLocal) return;

    const nombre = document.getElementById("edit-nombre").value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const puesto = document.getElementById("edit-puesto").value.trim();
    const departamento = document
      .getElementById("edit-departamento")
      .value.trim();
    const estado = document.getElementById("edit-estado").value;

    // Validar email
    if (!validarEmail(email)) {
      mostrarToast("Por favor ingresa un email válido", "error");
      return;
    }

    const payload = {
      nombre,
      email: email.toLowerCase(),
      puesto,
      departamento,
      estado,
    };

    const res = await api.put(`/personal/${id}`, payload);
    const updated = res && res.data ? res.data : res;
    const mapped = mapServerPersonal(updated);

    // Reemplazar en arreglo local
    personal = personal.map((p) => (String(p.id) === String(id) ? mapped : p));

    renderizarTablaPersonal();
    actualizarTodo();
    ocultarModal();
    mostrarToast("Empleado actualizado correctamente.", "success");
  } catch (err) {
    console.error("Error actualizando personal", err);

    // Mostrar mensaje de error más específico
    if (err.message && err.message.includes("email")) {
      mostrarToast("El email ingresado no es válido o ya existe", "error");
    } else {
      mostrarToast("Error al actualizar empleado.", "error");
    }
  }
}

// Eliminar empleado (usa API)
async function eliminarPersonal(id) {
  if (!confirm("¿Seguro que deseas eliminar este empleado?")) return;
  try {
    await api.delete(`/personal/${id}`);
    personal = personal.filter((p) => String(p.id) !== String(id));
    renderizarTablaPersonal();
    actualizarTodo();
    mostrarToast("Empleado eliminado.", "success");
  } catch (err) {
    console.error("Error eliminando personal", err);
    mostrarToast("Error al eliminar empleado.", "error");
  }
}

function guardarPersonal() {
  // Ahora usamos la API para persistir cambios. Esta función queda como registro local.
  console.log("Personal (local) actualizado. Elementos:", personal.length);
}

// Toast
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
  if (toast) toast.classList.add("hidden");
}

inicializar();
