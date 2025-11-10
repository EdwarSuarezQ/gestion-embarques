import apiService from '../../assets/JS/utils/apiService.js';

let embarcaciones = []; // Cache local para renderizado rápido

async function inicializar() {
  console.log("Inicializando módulo de embarcaciones...");
  await cargarEmbarcaciones();
  renderizarEmbarcaciones();
  configurarEventosGlobales();
}

// Cargar embarcaciones desde la API
async function cargarEmbarcaciones() {
  try {
    mostrarCargando(true);
    const response = await apiService.getEmbarcaciones(1, 100);
    if (response.success) {
      embarcaciones = response.data.data || response.data || [];
      console.log(`Cargadas ${embarcaciones.length} embarcaciones desde la API`);
    }
  } catch (error) {
    console.error("Error al cargar embarcaciones:", error);
    mostrarToast("Error al cargar las embarcaciones", "error");
    embarcaciones = [];
  } finally {
    mostrarCargando(false);
  }
}

function mostrarCargando(mostrar) {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = mostrar ? "block" : "none";
  }
}

function renderizarEmbarcaciones() {
  const moduleContent = document.getElementById("module-content");
  if (!moduleContent) {
    console.error("No se encontró el module-content");
    return;
  }

  // Crear estructura completa del módulo
  moduleContent.innerHTML = crearEstructuraCompleta();

  // Renderizar los componentes después de crear la estructura
  setTimeout(() => {
    renderizarTablaEmbarcaciones();
    actualizarTodo();
    configurarEventosTabla();
  }, 100);
}

function crearEstructuraCompleta() {
  const stats = calcularEstadisticas();
  const totalEmbarcaciones = embarcaciones.length;

  // Calcular porcentajes y variaciones
  const porcentajeActivas =
    totalEmbarcaciones > 0
      ? Math.round((stats.activas / totalEmbarcaciones) * 100)
      : 0;
  const porcentajePuerto =
    totalEmbarcaciones > 0
      ? Math.round((stats.enPuerto / totalEmbarcaciones) * 100)
      : 0;
  const variacionTotal = calcularVariacionTotal();
  const variacionActivas = calcularVariacionActivas();
  const variacionPuerto = calcularVariacionPuerto();

  return `
        <div class="embarcaciones-module">
            <!-- Estadísticas -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Embarcaciones activas</p>
                            <h2 class="text-2xl font-bold">${stats.activas}</h2>
                        </div>
                        <div class="p-2 bg-blue-100 rounded-md text-blue-600">
                            <i class="fas fa-ship"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          variacionActivas >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }">
                            <i class="fas ${
                              variacionActivas >= 0
                                ? "fa-arrow-up"
                                : "fa-arrow-down"
                            }"></i> ${Math.abs(variacionActivas)}%
                        </span>
                        desde el mes pasado
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">En puerto</p>
                            <h2 class="text-2xl font-bold">${
                              stats.enPuerto
                            }</h2>
                        </div>
                        <div class="p-2 bg-green-100 rounded-md text-green-600">
                            <i class="fas fa-anchor"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          variacionPuerto >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }">
                            <i class="fas ${
                              variacionPuerto >= 0
                                ? "fa-arrow-up"
                                : "fa-arrow-down"
                            }"></i> ${Math.abs(variacionPuerto)}%
                        </span>
                        desde el mes pasado
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Total embarcaciones</p>
                            <h2 class="text-2xl font-bold">${totalEmbarcaciones}</h2>
                        </div>
                        <div class="p-2 bg-yellow-100 rounded-md text-yellow-600">
                            <i class="fas fa-water"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          variacionTotal >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }">
                            <i class="fas ${
                              variacionTotal >= 0
                                ? "fa-arrow-up"
                                : "fa-arrow-down"
                            }"></i> ${Math.abs(variacionTotal)}%
                        </span>
                        desde el mes pasado
                    </div>
                </div>
            </div>

            <!-- Tabla de embarcaciones -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex flex-1 items-center">
                            <div class="relative flex-1 max-w-md">
                                <input type="text" placeholder="Buscar embarcaciones..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" id="buscar-embarcaciones">
                                <div class="absolute left-3 top-2.5 text-gray-400"><i class="fas fa-search"></i></div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div>
                                <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-estado">
                                    <option value="">Todos los estados</option>
                                    <option value="in-transit">En tránsito</option>
                                    <option value="in-route">En ruta</option>
                                    <option value="in-port">En puerto</option>
                                    <option value="pending">Pendiente</option>
                                </select>
                            </div>
                            <div>
                                <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-tipo">
                                    <option value="">Todos los tipos</option>
                                    <option value="container">Portacontenedores</option>
                                    <option value="bulk">Granelero</option>
                                    <option value="general">Carga general</option>
                                    <option value="tanker">Tanquero</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Embarcación</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">IMO / Tipo</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="embarcaciones-table-body" class="bg-white divide-y divide-gray-200">
                            <!-- Las embarcaciones se cargarán aquí dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Paneles inferiores -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow-md p-5">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Embarcaciones por Estado</h2>
                        <div class="text-sm text-gray-500">
                            <select class="border-none text-sm" id="filtro-periodo-embarcaciones">
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
                        <h2 class="text-lg font-semibold text-gray-800">Próximos Arribos</h2>
                        <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-800 text-sm">Ver todos</a>
                    </div>
                    <div class="space-y-3" id="proximos-arribos">
                        <!-- Los próximos arribos se cargarán dinámicamente -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderizarTablaEmbarcaciones() {
  const tableBody = document.getElementById("embarcaciones-table-body");
  if (!tableBody) {
    console.error("No se encontró el table body para embarcaciones");
    return;
  }

  tableBody.innerHTML = embarcaciones
    .map((embarcacion) => renderFilaEmbarcacion(embarcacion))
    .join("");
}

function getTipoBadge(tipo, imo) {
  const tipos = {
    container: {
      nombre: "Portacontenedores",
      color: "bg-blue-100 text-blue-800",
      icono: "fas fa-boxes-stacked",
    },
    bulk: {
      nombre: "Granelero",
      color: "bg-yellow-100 text-yellow-800",
      icono: "fas fa-mountain",
    },
    general: {
      nombre: "Carga general",
      color: "bg-green-100 text-green-800",
      icono: "fas fa-dolly",
    },
    tanker: {
      nombre: "Tanquero",
      color: "bg-red-100 text-red-800",
      icono: "fas fa-oil-can",
    },
  };

  const info = tipos[tipo] || {
    nombre: tipo,
    color: "bg-gray-100 text-gray-800",
    icono: "fas fa-ship",
  };

  return `
    <div class="flex flex-col items-center justify-center text-center">
      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${info.color}">
        <i class="${info.icono} mr-1"></i> ${info.nombre}
      </span>
      <div class="text-xs text-gray-500 mt-1">IMO: ${imo}</div>
    </div>
  `;
}

function renderFilaEmbarcacion(embarcacion) {
  return `
    <tr class="hover:bg-gray-50">
        <td class="px-4 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 text-center">${escapeHtml(
              embarcacion.nombre
            )}</div>
        </td>
        <td class="px-4 py-4 whitespace-nowrap">
            ${getTipoBadge(embarcacion.tipo, embarcacion.imo)}
        </td>
        <td class="px-4 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 text-center">
                <div class="flex items-center justify-center">
                  <span>${embarcacion.origen}</span>
                  <i class="fas fa-long-arrow-alt-right text-gray-400 mx-1"></i>

                  <span>${embarcacion.destino}</span>
                </div>
            </div>
        </td>
        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${
          embarcacion.fecha
        }</td>
        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${
          embarcacion.capacidad
        }</td>
        <td class="px-4 py-4 whitespace-nowrap">
            <div class="flex justify-center">
              <span class="status-badge status-${
                embarcacion.estado
              } border">${getEstadoText(embarcacion.estado)}</span>
            </div>
        </td>
        <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex justify-center space-x-2">
                <button class="text-blue-600 hover:text-blue-800 edit-btn" data-id="${
                  embarcacion._id || embarcacion.id
                }">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800 delete-btn" data-id="${
                  embarcacion._id || embarcacion.id
                }">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    </tr>
  `;
}

function actualizarTodo() {
  actualizarEstadisticasEstado();
  actualizarProximosArribos();
  actualizarTarjetasEstadisticas();
}

function calcularEstadisticas() {
  const activas = embarcaciones.filter(
    (e) => e.estado === "in-transit" || e.estado === "in-route"
  ).length;
  const enPuerto = embarcaciones.filter((e) => e.estado === "in-port").length;
  const total = embarcaciones.length;

  return {
    activas,
    enPuerto,
    total,
  };
}

function calcularVariacionTotal() {
  const embarcacionesActual = embarcaciones.length;
  // Simular datos del mes anterior (90% del actual)
  const embarcacionesAnterior = Math.round(embarcacionesActual * 0.9);

  if (embarcacionesAnterior === 0) return 0;
  return Math.round(
    ((embarcacionesActual - embarcacionesAnterior) / embarcacionesAnterior) *
      100
  );
}

function calcularVariacionActivas() {
  const activasActual = embarcaciones.filter(
    (e) => e.estado === "in-transit" || e.estado === "in-route"
  ).length;
  // Simular datos del mes anterior (85% del actual)
  const activasAnterior = Math.round(activasActual * 0.85);

  if (activasAnterior === 0) return 0;
  return Math.round(
    ((activasActual - activasAnterior) / activasAnterior) * 100
  );
}

function calcularVariacionPuerto() {
  const enPuertoActual = embarcaciones.filter(
    (e) => e.estado === "in-port"
  ).length;
  // Simular datos del mes anterior (110% del actual - más embarcaciones en puerto)
  const enPuertoAnterior = Math.round(enPuertoActual * 1.1);

  if (enPuertoAnterior === 0) return 0;
  return Math.round(
    ((enPuertoActual - enPuertoAnterior) / enPuertoAnterior) * 100
  );
}

function actualizarTarjetasEstadisticas() {
  const stats = calcularEstadisticas();
  const totalEmbarcaciones = embarcaciones.length;

  const variacionTotal = calcularVariacionTotal();
  const variacionActivas = calcularVariacionActivas();
  const variacionPuerto = calcularVariacionPuerto();

  // Actualizar tarjeta de embarcaciones activas
  const tarjetaActivas = document.querySelector(
    ".bg-white.border-l-4.border-blue-500"
  );
  if (tarjetaActivas) {
    tarjetaActivas.querySelector("h2").textContent = stats.activas;
    const porcentajeElement = tarjetaActivas.querySelector(".text-sm span");
    porcentajeElement.className = `${
      variacionActivas >= 0 ? "text-green-600" : "text-red-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      variacionActivas >= 0 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${Math.abs(variacionActivas)}% desde el mes pasado`;
  }

  // Actualizar tarjeta de embarcaciones en puerto
  const tarjetaPuerto = document.querySelector(
    ".bg-white.border-l-4.border-green-500"
  );
  if (tarjetaPuerto) {
    tarjetaPuerto.querySelector("h2").textContent = stats.enPuerto;
    const porcentajeElement = tarjetaPuerto.querySelector(".text-sm span");
    porcentajeElement.className = `${
      variacionPuerto >= 0 ? "text-green-600" : "text-red-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      variacionPuerto >= 0 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${Math.abs(variacionPuerto)}% desde el mes pasado`;
  }

  // Actualizar tarjeta de total embarcaciones
  const tarjetaTotal = document.querySelector(
    ".bg-white.border-l-4.border-yellow-500"
  );
  if (tarjetaTotal) {
    tarjetaTotal.querySelector("h2").textContent = totalEmbarcaciones;
    const porcentajeElement = tarjetaTotal.querySelector(".text-sm span");
    porcentajeElement.className = `${
      variacionTotal >= 0 ? "text-green-600" : "text-red-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      variacionTotal >= 0 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${Math.abs(variacionTotal)}% desde el mes pasado`;
  }
}

function actualizarEstadisticasEstado() {
  const container = document.getElementById("estadisticas-estado");
  if (!container) return;

  const estados = {
    "in-transit": {
      nombre: "En tránsito",
      color: "blue",
      cantidad: embarcaciones.filter((e) => e.estado === "in-transit").length,
    },
    "in-route": {
      nombre: "En ruta",
      color: "green",
      cantidad: embarcaciones.filter((e) => e.estado === "in-route").length,
    },
    "in-port": {
      nombre: "En puerto",
      color: "yellow",
      cantidad: embarcaciones.filter((e) => e.estado === "in-port").length,
    },
    pending: {
      nombre: "Pendientes",
      color: "gray",
      cantidad: embarcaciones.filter((e) => e.estado === "pending").length,
    },
  };

  const total = embarcaciones.length;

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
                    <span>${estado.cantidad} embarcaciones</span>
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

function actualizarProximosArribos() {
  const container = document.getElementById("proximos-arribos");
  if (!container) return;

  const proximos = embarcaciones
    .filter((e) => e.estado === "in-transit" || e.estado === "in-route")
    .slice(0, 4);

  container.innerHTML = proximos
    .map(
      (embarcacion) => `
            <div class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <i class="fas fa-ship"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-sm font-medium">${escapeHtml(
                      embarcacion.nombre
                    )}</h3>
                    <p class="text-xs text-gray-500">ETA: ${
                      embarcacion.fecha
                    } - ${embarcacion.origen} a ${embarcacion.destino}</p>
                </div>
                <span class="status-badge status-${
                  embarcacion.estado
                } border">${getEstadoText(embarcacion.estado)}</span>
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

  // Usar event delegation para el botón de nueva embarcación
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "btn-nueva-embarcacion" ||
      e.target.closest("#btn-nueva-embarcacion")
    ) {
      mostrarModalCrear();
    }
  });
}

function configurarEventosTabla() {
  const tableBody = document.getElementById("embarcaciones-table-body");
  if (!tableBody) return;

  // Usar event delegation para los botones de editar y eliminar
  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    const editBtn = target.closest(".edit-btn");
    const deleteBtn = target.closest(".delete-btn");

    if (editBtn) {
      const id = editBtn.dataset.id;
      mostrarModalEditar(id);
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      eliminarEmbarcacion(id);
    }
  });

  // Configurar filtros
  const filtroEstado = document.getElementById("filtro-estado");
  const filtroTipo = document.getElementById("filtro-tipo");
  const buscarEmbarcaciones = document.getElementById("buscar-embarcaciones");

  if (filtroEstado) {
    filtroEstado.addEventListener("change", aplicarFiltros);
  }
  if (filtroTipo) {
    filtroTipo.addEventListener("change", aplicarFiltros);
  }
  if (buscarEmbarcaciones) {
    buscarEmbarcaciones.addEventListener("input", aplicarFiltros);
  }
}

function aplicarFiltros() {
  const filtroEstado = document.getElementById("filtro-estado")?.value;
  const filtroTipo = document.getElementById("filtro-tipo")?.value;
  const textoBusqueda = document
    .getElementById("buscar-embarcaciones")
    ?.value.toLowerCase();

  let embarcacionesFiltradas = embarcaciones;

  if (filtroEstado) {
    embarcacionesFiltradas = embarcacionesFiltradas.filter(
      (e) => e.estado === filtroEstado
    );
  }

  if (filtroTipo) {
    embarcacionesFiltradas = embarcacionesFiltradas.filter(
      (e) => e.tipo === filtroTipo
    );
  }

  if (textoBusqueda) {
    embarcacionesFiltradas = embarcacionesFiltradas.filter(
      (e) =>
        e.nombre.toLowerCase().includes(textoBusqueda) ||
        e.imo.toLowerCase().includes(textoBusqueda) ||
        e.origen.toLowerCase().includes(textoBusqueda) ||
        e.destino.toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarTablaFiltrada(embarcacionesFiltradas);
}

function renderizarTablaFiltrada(embarcacionesFiltradas) {
  const tableBody = document.getElementById("embarcaciones-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = embarcacionesFiltradas
    .map((embarcacion) => renderFilaEmbarcacion(embarcacion))
    .join("");
}

// Funciones auxiliares
function getEstadoText(estado) {
  const estados = {
    pending: "Pendiente",
    "in-transit": "En tránsito",
    "in-route": "En ruta",
    "in-port": "En puerto",
  };
  return estados[estado] || estado;
}

function getTipoText(tipo) {
  const tipos = {
    container: "Portacontenedores",
    bulk: "Granelero",
    general: "Carga general",
    tanker: "Tanquero",
  };
  return tipos[tipo] || tipo;
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Número IMO *</label>
                <input type="text" id="create-imo" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Origen *</label>
                    <input type="text" id="create-origen" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
                    <input type="text" id="create-destino" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha ETA *</label>
                    <input type="date" id="create-fecha" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                    <input type="text" id="create-capacidad" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: 120,000 DWT">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                    <select id="create-tipo" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="container">Portacontenedores</option>
                        <option value="bulk">Granelero</option>
                        <option value="general">Carga general</option>
                        <option value="tanker">Tanquero</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="create-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="pending">Pendiente</option>
                        <option value="in-transit">En tránsito</option>
                        <option value="in-route">En ruta</option>
                        <option value="in-port">En puerto</option>
                    </select>
                </div>
            </div>
        </div>
    `;

  mostrarModal("Nueva Embarcación", campos, crearEmbarcacion);
}

async function mostrarModalEditar(id) {
  try {
    const response = await apiService.getEmbarcacion(id);
    if (!response.success) {
      mostrarToast("Error al cargar la embarcación", "error");
      return;
    }
    const embarcacion = response.data;

  // Convertir fecha de dd/mm/yyyy a yyyy-mm-dd para el input date
  const [dia, mes, anio] = embarcacion.fecha.split("/");
  const fechaInput = `${anio}-${mes}-${dia}`;

  const campos = `
        <div class="space-y-4">
            <input type="hidden" id="edit-id" value="${embarcacion._id || embarcacion.id}">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" id="edit-nombre" value="${escapeHtml(
                  embarcacion.nombre
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número IMO *</label>
                <input type="text" id="edit-imo" value="${
                  embarcacion.imo
                }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Origen *</label>
                    <input type="text" id="edit-origen" value="${escapeHtml(
                      embarcacion.origen
                    )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
                    <input type="text" id="edit-destino" value="${escapeHtml(
                      embarcacion.destino
                    )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha ETA *</label>
                    <input type="date" id="edit-fecha" value="${fechaInput}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                    <input type="text" id="edit-capacidad" value="${
                      embarcacion.capacidad
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                    <select id="edit-tipo" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="container" ${
                          embarcacion.tipo === "container" ? "selected" : ""
                        }>Portacontenedores</option>
                        <option value="bulk" ${
                          embarcacion.tipo === "bulk" ? "selected" : ""
                        }>Granelero</option>
                        <option value="general" ${
                          embarcacion.tipo === "general" ? "selected" : ""
                        }>Carga general</option>
                        <option value="tanker" ${
                          embarcacion.tipo === "tanker" ? "selected" : ""
                        }>Tanquero</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="edit-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="pending" ${
                          embarcacion.estado === "pending" ? "selected" : ""
                        }>Pendiente</option>
                        <option value="in-transit" ${
                          embarcacion.estado === "in-transit" ? "selected" : ""
                        }>En tránsito</option>
                        <option value="in-route" ${
                          embarcacion.estado === "in-route" ? "selected" : ""
                        }>En ruta</option>
                        <option value="in-port" ${
                          embarcacion.estado === "in-port" ? "selected" : ""
                        }>En puerto</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    mostrarModal("Editar Embarcación", campos, editarEmbarcacion);
  } catch (error) {
    console.error("Error al cargar embarcación:", error);
    mostrarToast("Error al cargar la embarcación", "error");
  }
}

async function crearEmbarcacion() {
  const nombre = document.getElementById("create-nombre")?.value.trim();
  const imo = document.getElementById("create-imo")?.value.trim();
  const origen = document.getElementById("create-origen")?.value.trim();
  const destino = document.getElementById("create-destino")?.value.trim();
  const fechaInput = document.getElementById("create-fecha")?.value;

  if (!nombre || !imo || !origen || !destino || !fechaInput) {
    mostrarToast("Por favor complete todos los campos obligatorios", "error");
    return;
  }

  // Convertir fecha de yyyy-mm-dd a dd/mm/yyyy
  const [anio, mes, dia] = fechaInput.split("-");
  const fecha = `${dia}/${mes}/${anio}`;

  const nuevaEmbarcacion = {
    nombre: nombre,
    imo: imo,
    origen: origen,
    destino: destino,
    fecha: fecha,
    capacidad: document.getElementById("create-capacidad")?.value.trim() || "N/A",
    tipo: document.getElementById("create-tipo")?.value || "container",
    estado: document.getElementById("create-estado")?.value || "pending",
  };

  try {
    mostrarCargando(true);
    const response = await apiService.createEmbarcacion(nuevaEmbarcacion);
    if (response.success) {
      await cargarEmbarcaciones();
      renderizarEmbarcaciones();
      ocultarModal();
      mostrarToast("¡Embarcación creada con éxito!");
    } else {
      mostrarToast("Error al crear la embarcación", "error");
    }
  } catch (error) {
    console.error("Error al crear embarcación:", error);
    mostrarToast("Error al crear la embarcación", "error");
  } finally {
    mostrarCargando(false);
  }
}

async function editarEmbarcacion() {
  const id = document.getElementById("edit-id")?.value;
  if (!id) return;

  const fechaInput = document.getElementById("edit-fecha")?.value;
  const [anio, mes, dia] = fechaInput.split("-");
  const fecha = `${dia}/${mes}/${anio}`;

  const embarcacionActualizada = {
    nombre: document.getElementById("edit-nombre")?.value.trim() || "",
    imo: document.getElementById("edit-imo")?.value.trim() || "",
    origen: document.getElementById("edit-origen")?.value.trim() || "",
    destino: document.getElementById("edit-destino")?.value.trim() || "",
    fecha: fecha,
    capacidad: document.getElementById("edit-capacidad")?.value.trim() || "N/A",
    tipo: document.getElementById("edit-tipo")?.value || "container",
    estado: document.getElementById("edit-estado")?.value || "pending",
  };

  try {
    mostrarCargando(true);
    const response = await apiService.updateEmbarcacion(id, embarcacionActualizada);
    if (response.success) {
      await cargarEmbarcaciones();
      renderizarEmbarcaciones();
      ocultarModal();
      mostrarToast("¡Embarcación actualizada con éxito!");
    } else {
      mostrarToast("Error al actualizar la embarcación", "error");
    }
  } catch (error) {
    console.error("Error al actualizar embarcación:", error);
    mostrarToast("Error al actualizar la embarcación", "error");
  } finally {
    mostrarCargando(false);
  }
}

async function eliminarEmbarcacion(id) {
  if (!confirm("¿Estás seguro de que quieres eliminar esta embarcación?")) return;

  try {
    mostrarCargando(true);
    const response = await apiService.deleteEmbarcacion(id);
    if (response.success) {
      await cargarEmbarcaciones();
      renderizarEmbarcaciones();
      mostrarToast("¡Embarcación eliminada con éxito!");
    } else {
      mostrarToast("Error al eliminar la embarcación", "error");
    }
  } catch (error) {
    console.error("Error al eliminar embarcación:", error);
    mostrarToast("Error al eliminar la embarcación", "error");
  } finally {
    mostrarCargando(false);
  }
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

inicializar();
