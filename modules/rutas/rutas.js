// Variables globales
let rutas = [];

// Función de inicialización que se ejecutará cuando el módulo se cargue
function inicializarModulo() {
  console.log("Inicializando módulo...");
  // Mover el contenido de inicializar aquí

  renderizarRutas();
  configurarEventosGlobales();
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarModulo);
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  inicializarModulo();
}

function renderizarRutas() {
  const moduleContent = document.getElementById("module-content");
  if (!moduleContent) {
    console.error("No se encontró el module-content");
    return;
  }

  // Crear estructura completa del módulo
  moduleContent.innerHTML = crearEstructuraCompleta();

  // Renderizar los componentes después de crear la estructura
  setTimeout(() => {
    renderizarTablaRutas();
    actualizarTodo();
    configurarEventosTabla();
  }, 100);
}

function crearEstructuraCompleta() {
  const stats = calcularEstadisticas();
  const totalRutas = rutas.length;
  const porcentajeActivas =
    totalRutas > 0 ? Math.round((stats.rutasActivas / totalRutas) * 100) : 0;
  const variacionViajes = calcularVariacionViajes();

  return `
    <div class="rutas-module">
        <!-- Estadísticas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Rutas activas</p>
                        <h2 class="text-2xl font-bold">${
                          stats.rutasActivas
                        }</h2>
                    </div>
                    <div class="p-2 bg-purple-100 rounded-md text-purple-600">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="${
                      porcentajeActivas > 50
                        ? "text-green-600"
                        : "text-yellow-600"
                    }">
                        <i class="fas ${
                          porcentajeActivas > 50
                            ? "fa-arrow-up"
                            : "fa-arrow-down"
                        }"></i> ${porcentajeActivas}%
                    </span>
                    del total
                </div>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-pink-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Distancia promedio</p>
                        <h2 class="text-2xl font-bold">${
                          stats.distanciaPromedio
                        } nm</h2>
                    </div>
                    <div class="p-2 bg-pink-100 rounded-md text-pink-600">
                        <i class="fas fa-compass"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="${
                      stats.distanciaPromedio > 5000
                        ? "text-green-600"
                        : "text-blue-600"
                    }">
                        <i class="fas ${
                          stats.distanciaPromedio > 5000
                            ? "fa-arrow-up"
                            : "fa-arrow-right"
                        }"></i> ${
    stats.distanciaPromedio > 5000 ? "Larga" : "Media"
  }
                    </span>
                    distancia
                </div>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-teal-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">Viajes este año</p>
                        <h2 class="text-2xl font-bold">${stats.totalViajes}</h2>
                    </div>
                    <div class="p-2 bg-teal-100 rounded-md text-teal-600">
                        <i class="fas fa-ship"></i>
                    </div>
                </div>
                <div class="mt-2 text-sm">
                    <span class="${
                      variacionViajes >= 0 ? "text-green-600" : "text-red-600"
                    }">
                        <i class="fas ${
                          variacionViajes >= 0 ? "fa-arrow-up" : "fa-arrow-down"
                        }"></i> ${Math.abs(variacionViajes)}%
                    </span>
                    vs. promedio
                </div>
            </div>
        </div>

        <!-- Tabla de rutas -->
        <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="p-4 border-b border-gray-200">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex flex-1 items-center">
                        <div class="relative flex-1 max-w-md">
                            <input type="text" placeholder="Buscar rutas..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" id="buscar-rutas">
                            <div class="absolute left-3 top-2.5 text-gray-400"><i class="fas fa-search"></i></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-estado">
                                <option value="">Todos los estados</option>
                                <option value="active">Activa</option>
                                <option value="pending">Pendiente</option>
                                <option value="completed">Completada</option>
                                <option value="inactive">Inactiva</option>
                            </select>
                        </div>
                        <div>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-tipo">
                                <option value="">Todos los tipos</option>
                                <option value="international">Internacional</option>
                                <option value="regional">Regional</option>
                                <option value="coastal">Costera</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Ruta</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distancia</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="rutas-table-body" class="bg-white divide-y divide-gray-200">
                        <!-- Las rutas se cargarán aquí dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Paneles inferiores -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-md p-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Rutas por Tipo</h2>
                    <div class="text-sm text-gray-500">
                        <select class="border-none text-sm">
                            <option>Este Año</option>
                            <option>Últimos 6 meses</option>
                            <option>Total</option>
                        </select>
                    </div>
                </div>
                <div class="space-y-4" id="estadisticas-tipo">
                    <!-- Las estadísticas se cargarán dinámicamente -->
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Próximas Salidas</h2>
                    <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-800 text-sm">Ver todas</a>
                </div>
                <div class="space-y-3" id="proximas-salidas">
                    <!-- Las próximas salidas se cargarán dinámicamente -->
                </div>
            </div>
        </div>
    </div>
    `;
}

function calcularEstadisticas() {
  const rutasActivas = rutas.filter((r) => r.estado === "active").length;
  const rutasTotales = rutas.length;

  const distanciaTotal = rutas.reduce((sum, r) => {
    return sum + (parseInt(r.distancia.replace(/[^0-9]/g, "")) || 0);
  }, 0);

  const distanciaPromedio =
    rutasTotales > 0 ? Math.round(distanciaTotal / rutasTotales) : 0;
  const totalViajes = rutas.reduce((sum, r) => sum + (r.viajesAnio || 0), 0);

  return {
    rutasActivas,
    rutasTotales,
    distanciaTotal: distanciaTotal.toLocaleString(),
    distanciaPromedio: distanciaPromedio.toLocaleString(),
    totalViajes: totalViajes.toLocaleString(),
  };
}

function calcularVariacionViajes() {
  const totalViajes = rutas.reduce((sum, r) => sum + (r.viajesAnio || 0), 0);
  const promedioViajes = rutas.length > 0 ? totalViajes / rutas.length : 0;
  const viajesPorRuta =
    rutas.reduce((sum, r) => sum + r.viajesAnio, 0) / rutas.length;

  if (promedioViajes === 0) return 0;
  return Math.round(((totalViajes - promedioViajes) / promedioViajes) * 100);
}

function actualizarTodo() {
  actualizarEstadisticasTipo();
  actualizarProximasSalidas();
  actualizarTarjetasEstadisticas();
}

function actualizarTarjetasEstadisticas() {
  const stats = calcularEstadisticas();
  const totalRutas = rutas.length;
  const porcentajeActivas =
    totalRutas > 0 ? Math.round((stats.rutasActivas / totalRutas) * 100) : 0;
  const variacionViajes = calcularVariacionViajes();

  // Actualizar tarjeta de rutas activas
  const tarjetaActivas = document.querySelector(
    ".bg-white.border-l-4.border-purple-500"
  );
  if (tarjetaActivas) {
    tarjetaActivas.querySelector("h2").textContent = stats.rutasActivas;
    const porcentajeElement = tarjetaActivas.querySelector(".text-sm span");
    porcentajeElement.className = `${
      porcentajeActivas > 50 ? "text-green-600" : "text-yellow-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      porcentajeActivas > 50 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${porcentajeActivas}% del total`;
  }

  // Actualizar tarjeta de distancia promedio
  const tarjetaDistancia = document.querySelector(
    ".bg-white.border-l-4.border-pink-500"
  );
  if (tarjetaDistancia) {
    tarjetaDistancia.querySelector(
      "h2"
    ).textContent = `${stats.distanciaPromedio} nm`;
    const porcentajeElement = tarjetaDistancia.querySelector(".text-sm span");
    porcentajeElement.className = `${
      stats.distanciaPromedio > 5000 ? "text-green-600" : "text-blue-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      stats.distanciaPromedio > 5000 ? "fa-arrow-up" : "fa-arrow-right"
    }"></i> ${stats.distanciaPromedio > 5000 ? "Larga" : "Media"} distancia`;
  }

  // Actualizar tarjeta de viajes
  const tarjetaViajes = document.querySelector(
    ".bg-white.border-l-4.border-teal-500"
  );
  if (tarjetaViajes) {
    tarjetaViajes.querySelector("h2").textContent = stats.totalViajes;
    const porcentajeElement = tarjetaViajes.querySelector(".text-sm span");
    porcentajeElement.className = `${
      variacionViajes >= 0 ? "text-green-600" : "text-red-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      variacionViajes >= 0 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${Math.abs(variacionViajes)}% vs. promedio`;
  }
}

function renderizarTablaRutas() {
  const tableBody = document.getElementById("rutas-table-body");
  if (!tableBody) {
    console.error("No se encontró el table body para rutas");
    return;
  }

  tableBody.innerHTML = rutas.map((ruta) => renderFilaRuta(ruta)).join("");
}

function renderFilaRuta(ruta) {
  return `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${ruta.idRuta}</div>
          <div class="text-sm text-gray-500">${ruta.nombre}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${ruta.origen}</div>
          <div class="text-xs text-gray-500">${ruta.paisOrigen}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${ruta.destino}</div>
          <div class="text-xs text-gray-500">${ruta.paisDestino}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
          ruta.distancia
        }</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
          ruta.duracion
        }</td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${getBadgeTipoRuta(ruta.tipo)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="status-badge status-${
            ruta.estado
          } border">${getEstadoText(ruta.estado)}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="text-blue-600 hover:text-blue-800 mr-3 edit-ruta-btn" data-id="${
            ruta.id
          }">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-600 hover:text-red-800 delete-ruta-btn" data-id="${
            ruta.id
          }">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
}

function actualizarEstadisticasTipo() {
  const container = document.getElementById("estadisticas-tipo");
  if (!container) return;

  const tipos = {
    international: {
      nombre: "Internacional",
      color: "blue",
      cantidad: rutas.filter((r) => r.tipo === "international").length,
    },
    regional: {
      nombre: "Regional",
      color: "green",
      cantidad: rutas.filter((r) => r.tipo === "regional").length,
    },
    coastal: {
      nombre: "Costera",
      color: "yellow",
      cantidad: rutas.filter((r) => r.tipo === "coastal").length,
    },
  };

  const total = rutas.length;

  container.innerHTML = Object.values(tipos)
    .map(
      (tipo) => `
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="flex items-center">
              <span class="w-3 h-3 bg-${
                tipo.color
              }-500 rounded-full mr-2"></span>
              ${tipo.nombre}
            </span>
            <span>${tipo.cantidad} rutas</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-${tipo.color}-500 h-2 rounded-full" style="width: ${
        total > 0 ? (tipo.cantidad / total) * 100 : 0
      }%"></div>
          </div>
        </div>
      `
    )
    .join("");
}

function actualizarProximasSalidas() {
  const container = document.getElementById("proximas-salidas");
  if (!container) return;

  const proximas = rutas
    .filter((r) => r.estado === "active" || r.estado === "pending")
    .slice(0, 4);

  container.innerHTML = proximas
    .map(
      (ruta) => `
        <div class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
          <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
            <i class="fas fa-route"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium">${ruta.idRuta} - ${ruta.origen} a ${
        ruta.destino
      }</h3>
            <p class="text-xs text-gray-500">Duración: ${ruta.duracion}</p>
          </div>
          <span class="status-badge status-${
            ruta.estado
          } border">${getEstadoText(ruta.estado)}</span>
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

  // Usar event delegation para el botón de nueva ruta
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "btn-nueva-ruta" ||
      e.target.closest("#btn-nueva-ruta")
    ) {
      mostrarModalCrear();
    }
  });
}

function configurarEventosTabla() {
  const tableBody = document.getElementById("rutas-table-body");
  if (!tableBody) return;

  // Usar event delegation para los botones de editar y eliminar
  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    const editBtn = target.closest(".edit-ruta-btn");
    const deleteBtn = target.closest(".delete-ruta-btn");

    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      mostrarModalEditar(id);
    }

    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      eliminarRuta(id);
    }
  });

  // Configurar filtros
  const filtroEstado = document.getElementById("filtro-estado");
  const filtroTipo = document.getElementById("filtro-tipo");
  const buscarRutas = document.getElementById("buscar-rutas");

  if (filtroEstado) {
    filtroEstado.addEventListener("change", aplicarFiltros);
  }
  if (filtroTipo) {
    filtroTipo.addEventListener("change", aplicarFiltros);
  }
  if (buscarRutas) {
    buscarRutas.addEventListener("input", aplicarFiltros);
  }
}

function aplicarFiltros() {
  const filtroEstado = document.getElementById("filtro-estado")?.value;
  const filtroTipo = document.getElementById("filtro-tipo")?.value;
  const textoBusqueda = document
    .getElementById("buscar-rutas")
    ?.value.toLowerCase();

  let rutasFiltradas = rutas;

  if (filtroEstado) {
    rutasFiltradas = rutasFiltradas.filter((r) => r.estado === filtroEstado);
  }

  if (filtroTipo) {
    rutasFiltradas = rutasFiltradas.filter((r) => r.tipo === filtroTipo);
  }

  if (textoBusqueda) {
    rutasFiltradas = rutasFiltradas.filter(
      (r) =>
        r.idRuta.toLowerCase().includes(textoBusqueda) ||
        r.nombre.toLowerCase().includes(textoBusqueda) ||
        r.origen.toLowerCase().includes(textoBusqueda) ||
        r.destino.toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarTablaFiltrada(rutasFiltradas);
}

function renderizarTablaFiltrada(rutasFiltradas) {
  const tableBody = document.getElementById("rutas-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = rutasFiltradas
    .map((ruta) => renderFilaRuta(ruta))
    .join("");
}

// Funciones auxiliares
function getBadgeTipoRuta(tipo) {
  const badges = {
    international:
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-globe-americas mr-1"></i>Internacional</span>',
    regional:
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-map mr-1"></i>Regional</span>',
    coastal:
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i class="fas fa-water mr-1"></i>Costera</span>',
  };
  return (
    badges[tipo] ||
    '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Desconocido</span>'
  );
}

function getEstadoText(estado) {
  const estados = {
    active: "Activa",
    pending: "Pendiente",
    completed: "Completada",
    inactive: "Inactiva",
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
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Ruta *</label>
                <input type="text" id="create-idRuta" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Ruta *</label>
                <input type="text" id="create-nombre" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Origen *</label>
                    <input type="text" id="create-origen" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">País Origen *</label>
                    <input type="text" id="create-paisOrigen" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
                    <input type="text" id="create-destino" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">País Destino *</label>
                    <input type="text" id="create-paisDestino" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Distancia (nm) *</label>
                    <input type="text" id="create-distancia" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Duración *</label>
                    <input type="text" id="create-duracion" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Ruta *</label>
                    <select id="create-tipo" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="international">Internacional</option>
                        <option value="regional">Regional</option>
                        <option value="coastal">Costera</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="create-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="active">Activa</option>
                        <option value="pending">Pendiente</option>
                        <option value="completed">Completada</option>
                        <option value="inactive">Inactiva</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Viajes este año</label>
                <input type="number" id="create-viajesAnio" class="w-full px-3 py-2 border border-gray-300 rounded-md" value="0">
            </div>
        </div>
    `;

  mostrarModal("Nueva Ruta", campos, crearRuta);
}

function mostrarModalEditar(id) {
  const ruta = rutas.find((r) => r.id === id);
  if (!ruta) return;

  const campos = `
        <div class="space-y-4">
            <input type="hidden" id="edit-id" value="${ruta.id}">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Ruta *</label>
                <input type="text" id="edit-idRuta" value="${
                  ruta.idRuta
                }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Ruta *</label>
                <input type="text" id="edit-nombre" value="${
                  ruta.nombre
                }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Origen *</label>
                    <input type="text" id="edit-origen" value="${
                      ruta.origen
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">País Origen *</label>
                    <input type="text" id="edit-paisOrigen" value="${
                      ruta.paisOrigen
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
                    <input type="text" id="edit-destino" value="${
                      ruta.destino
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">País Destino *</label>
                    <input type="text" id="edit-paisDestino" value="${
                      ruta.paisDestino
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Distancia (nm) *</label>
                    <input type="text" id="edit-distancia" value="${
                      ruta.distancia
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Duración *</label>
                    <input type="text" id="edit-duracion" value="${
                      ruta.duracion
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Ruta *</label>
                    <select id="edit-tipo" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="international" ${
                          ruta.tipo === "international" ? "selected" : ""
                        }>Internacional</option>
                        <option value="regional" ${
                          ruta.tipo === "regional" ? "selected" : ""
                        }>Regional</option>
                        <option value="coastal" ${
                          ruta.tipo === "coastal" ? "selected" : ""
                        }>Costera</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="edit-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="active" ${
                          ruta.estado === "active" ? "selected" : ""
                        }>Activa</option>
                        <option value="pending" ${
                          ruta.estado === "pending" ? "selected" : ""
                        }>Pendiente</option>
                        <option value="completed" ${
                          ruta.estado === "completed" ? "selected" : ""
                        }>Completada</option>
                        <option value="inactive" ${
                          ruta.estado === "inactive" ? "selected" : ""
                        }>Inactiva</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Viajes este año</label>
                <input type="number" id="edit-viajesAnio" value="${
                  ruta.viajesAnio
                }" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>
        </div>
    `;

  mostrarModal("Editar Ruta", campos, editarRuta);
}

function crearRuta() {
  const idRuta = document.getElementById("create-idRuta")?.value.trim();
  const nombre = document.getElementById("create-nombre")?.value.trim();
  const origen = document.getElementById("create-origen")?.value.trim();
  const paisOrigen = document.getElementById("create-paisOrigen")?.value.trim();
  const destino = document.getElementById("create-destino")?.value.trim();
  const paisDestino = document
    .getElementById("create-paisDestino")
    ?.value.trim();

  if (
    !idRuta ||
    !nombre ||
    !origen ||
    !paisOrigen ||
    !destino ||
    !paisDestino
  ) {
    mostrarToast("Por favor complete todos los campos obligatorios", "error");
    return;
  }

  const nuevaRuta = {
    id: Date.now(),
    idRuta: idRuta,
    nombre: nombre,
    origen: origen,
    paisOrigen: paisOrigen,
    destino: destino,
    paisDestino: paisDestino,
    distancia: document.getElementById("create-distancia")?.value.trim() || "",
    duracion: document.getElementById("create-duracion")?.value.trim() || "",
    tipo: document.getElementById("create-tipo")?.value || "international",
    estado: document.getElementById("create-estado")?.value || "active",
    viajesAnio:
      parseInt(document.getElementById("create-viajesAnio")?.value) || 0,
  };

  rutas.push(nuevaRuta);
  guardarRutas();
  renderizarRutas();
  ocultarModal();
  mostrarToast("¡Ruta creada con éxito!");
}

function editarRuta() {
  const id = parseInt(document.getElementById("edit-id")?.value);
  const rutaIndex = rutas.findIndex((r) => r.id === id);

  if (rutaIndex !== -1) {
    rutas[rutaIndex] = {
      ...rutas[rutaIndex],
      idRuta: document.getElementById("edit-idRuta")?.value.trim() || "",
      nombre: document.getElementById("edit-nombre")?.value.trim() || "",
      origen: document.getElementById("edit-origen")?.value.trim() || "",
      paisOrigen:
        document.getElementById("edit-paisOrigen")?.value.trim() || "",
      destino: document.getElementById("edit-destino")?.value.trim() || "",
      paisDestino:
        document.getElementById("edit-paisDestino")?.value.trim() || "",
      distancia: document.getElementById("edit-distancia")?.value.trim() || "",
      duracion: document.getElementById("edit-duracion")?.value.trim() || "",
      tipo: document.getElementById("edit-tipo")?.value || "international",
      estado: document.getElementById("edit-estado")?.value || "active",
      viajesAnio:
        parseInt(document.getElementById("edit-viajesAnio")?.value) || 0,
    };

    guardarRutas();
    renderizarRutas();
    ocultarModal();
    mostrarToast("¡Ruta actualizada con éxito!");
  }
}

function eliminarRuta(id) {
  if (confirm("¿Estás seguro de que quieres eliminar esta ruta?")) {
    rutas = rutas.filter((r) => r.id !== id);
    guardarRutas();
    renderizarRutas();
    mostrarToast("¡Ruta eliminada con éxito!");
  }
}

function guardarRutas() {
  // Los datos se mantienen en el arreglo rutas en memoria
  // No se usa localStorage, los datos persisten durante la sesión
  console.log("Rutas guardadas en memoria:", rutas.length, "elementos");
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
