let facturas = [];

// Función de inicialización que se ejecutará cuando el módulo se cargue
function inicializarModulo() {
  console.log("Inicializando módulo...");
  // Mover el contenido de inicializar aquí

  renderizarFacturas();
  configurarEventosGlobales();
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarModulo);
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  inicializarModulo();
}

function renderizarFacturas() {
  const moduleContent = document.getElementById("module-content");
  if (!moduleContent) {
    console.error("No se encontró el module-content");
    return;
  }

  // Crear estructura completa del módulo
  moduleContent.innerHTML = crearEstructuraCompleta();

  // Renderizar los componentes después de crear la estructura
  setTimeout(() => {
    renderizarTablaFacturas();
    actualizarTodo();
    configurarEventosTabla();
  }, 100);
}

function crearEstructuraCompleta() {
  const stats = calcularEstadisticas();
  const totalFacturas = facturas.length;
  const porcentajePagadas =
    totalFacturas > 0
      ? Math.round((stats.facturasPagadas / totalFacturas) * 100)
      : 0;
  const porcentajePendientes =
    totalFacturas > 0
      ? Math.round((stats.facturasPendientes / totalFacturas) * 100)
      : 0;
  const variacionIngresos = calcularVariacionIngresos();

  return `
        <div class="facturas-module">
            <!-- Estadísticas -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-emerald-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Facturas pendientes</p>
                            <h2 class="text-2xl font-bold">${
                              stats.facturasPendientes
                            }</h2>
                        </div>
                        <div class="p-2 bg-emerald-100 rounded-md text-emerald-600">
                            <i class="fas fa-file-alt"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          porcentajePendientes > 30
                            ? "text-red-600"
                            : "text-green-600"
                        }">
                            <i class="fas ${
                              porcentajePendientes > 30
                                ? "fa-arrow-up"
                                : "fa-arrow-down"
                            }"></i> ${porcentajePendientes}%
                        </span>
                        del total
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-sky-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Facturas pagadas</p>
                            <h2 class="text-2xl font-bold">${
                              stats.facturasPagadas
                            }</h2>
                        </div>
                        <div class="p-2 bg-sky-100 rounded-md text-sky-600">
                            <i class="fas fa-money-check-alt"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          porcentajePagadas > 70
                            ? "text-green-600"
                            : "text-yellow-600"
                        }">
                            <i class="fas ${
                              porcentajePagadas > 70
                                ? "fa-arrow-up"
                                : "fa-arrow-down"
                            }"></i> ${porcentajePagadas}%
                        </span>
                        tasa de éxito
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-rose-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Ingresos totales</p>
                            <h2 class="text-2xl font-bold">${
                              stats.ingresosTotales
                            }</h2>
                        </div>
                        <div class="p-2 bg-rose-100 rounded-md text-rose-600">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          variacionIngresos >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }">
                            <i class="fas ${
                              variacionIngresos >= 0
                                ? "fa-arrow-up"
                                : "fa-arrow-down"
                            }"></i> ${Math.abs(variacionIngresos)}%
                        </span>
                        vs. mes anterior
                    </div>
                </div>
            </div>

            <!-- Tabla de facturas -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex flex-1 items-center">
                            <div class="relative flex-1 max-w-md">
                                <input type="text" placeholder="Buscar facturas..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" id="buscar-facturas">
                                <div class="absolute left-3 top-2.5 text-gray-400"><i class="fas fa-search"></i></div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div>
                                <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-estado">
                                    <option value="">Todos los estados</option>
                                    <option value="paid">Pagada</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="overdue">Vencida</option>
                                    <option value="cancelled">Cancelada</option>
                                </select>
                            </div>
                            <div>
                                <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-cliente">
                                    <option value="">Todos los clientes</option>
                                    ${generarOpcionesClientes()}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Factura</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Emisión</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="facturas-table-body" class="bg-white divide-y divide-gray-200">
                            <!-- Las facturas se cargarán aquí dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Paneles inferiores -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow-md p-5">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Facturas por Estado</h2>
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
                        <h2 class="text-lg font-semibold text-gray-800">Próximos Vencimientos</h2>
                        <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-800 text-sm">Ver todos</a>
                    </div>
                    <div class="space-y-3" id="proximos-vencimientos">
                        <!-- Los próximos vencimientos se cargarán dinámicamente -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderizarTablaFacturas() {
  const tableBody = document.getElementById("facturas-table-body");
  if (!tableBody) {
    console.error("No se encontró el table body para facturas");
    return;
  }

  tableBody.innerHTML = facturas
    .map((factura) => renderFilaFactura(factura))
    .join("");
}

function renderFilaFactura(factura) {
  return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${escapeHtml(
                  factura.idFactura
                )}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(
                  factura.cliente
                )}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
              factura.fechaEmision
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatearMoneda(
              factura.monto
            )}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getBadgeEstado(factura.estado)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-800 mr-3 edit-btn" data-id="${
                  factura.id
                }">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800 delete-btn" data-id="${
                  factura.id
                }">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

function actualizarTodo() {
  actualizarEstadisticasEstado();
  actualizarProximosVencimientos();
  actualizarTarjetasEstadisticas();
}

function calcularEstadisticas() {
  const facturasPendientes = facturas.filter(
    (f) => f.estado === "pending"
  ).length;
  const facturasPagadas = facturas.filter((f) => f.estado === "paid").length;

  const ingresosTotales = facturas
    .filter((f) => f.estado === "paid")
    .reduce((sum, f) => sum + f.monto, 0);

  return {
    facturasPendientes,
    facturasPagadas,
    ingresosTotales: formatearMoneda(ingresosTotales),
    facturasTotales: facturas.length,
  };
}

function calcularVariacionIngresos() {
  const ingresosActuales = facturas
    .filter((f) => f.estado === "paid")
    .reduce((sum, f) => sum + f.monto, 0);

  // Simular ingresos del mes anterior (80% de los actuales)
  const ingresosMesAnterior = ingresosActuales * 0.8;

  if (ingresosMesAnterior === 0) return 0;
  return Math.round(
    ((ingresosActuales - ingresosMesAnterior) / ingresosMesAnterior) * 100
  );
}

function actualizarTarjetasEstadisticas() {
  const stats = calcularEstadisticas();
  const totalFacturas = facturas.length;
  const porcentajePagadas =
    totalFacturas > 0
      ? Math.round((stats.facturasPagadas / totalFacturas) * 100)
      : 0;
  const porcentajePendientes =
    totalFacturas > 0
      ? Math.round((stats.facturasPendientes / totalFacturas) * 100)
      : 0;
  const variacionIngresos = calcularVariacionIngresos();

  // Actualizar tarjeta de facturas pendientes
  const tarjetaPendientes = document.querySelector(
    ".bg-white.border-l-4.border-emerald-500"
  );
  if (tarjetaPendientes) {
    tarjetaPendientes.querySelector("h2").textContent =
      stats.facturasPendientes;
    const porcentajeElement = tarjetaPendientes.querySelector(".text-sm span");
    porcentajeElement.className = `${
      porcentajePendientes > 30 ? "text-red-600" : "text-green-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      porcentajePendientes > 30 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${porcentajePendientes}% del total`;
  }

  // Actualizar tarjeta de facturas pagadas
  const tarjetaPagadas = document.querySelector(
    ".bg-white.border-l-4.border-sky-500"
  );
  if (tarjetaPagadas) {
    tarjetaPagadas.querySelector("h2").textContent = stats.facturasPagadas;
    const porcentajeElement = tarjetaPagadas.querySelector(".text-sm span");
    porcentajeElement.className = `${
      porcentajePagadas > 70 ? "text-green-600" : "text-yellow-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      porcentajePagadas > 70 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${porcentajePagadas}% tasa de éxito`;
  }

  // Actualizar tarjeta de ingresos
  const tarjetaIngresos = document.querySelector(
    ".bg-white.border-l-4.border-rose-500"
  );
  if (tarjetaIngresos) {
    tarjetaIngresos.querySelector("h2").textContent = stats.ingresosTotales;
    const porcentajeElement = tarjetaIngresos.querySelector(".text-sm span");
    porcentajeElement.className = `${
      variacionIngresos >= 0 ? "text-green-600" : "text-red-600"
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      variacionIngresos >= 0 ? "fa-arrow-up" : "fa-arrow-down"
    }"></i> ${Math.abs(variacionIngresos)}% vs. mes anterior`;
  }
}

function actualizarEstadisticasEstado() {
  const container = document.getElementById("estadisticas-estado");
  if (!container) return;

  const estados = {
    paid: {
      nombre: "Pagadas",
      color: "green",
      cantidad: facturas.filter((f) => f.estado === "paid").length,
    },
    pending: {
      nombre: "Pendientes",
      color: "yellow",
      cantidad: facturas.filter((f) => f.estado === "pending").length,
    },
    overdue: {
      nombre: "Vencidas",
      color: "red",
      cantidad: facturas.filter((f) => f.estado === "overdue").length,
    },
    cancelled: {
      nombre: "Canceladas",
      color: "gray",
      cantidad: facturas.filter((f) => f.estado === "cancelled").length,
    },
  };

  const total = facturas.length;

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
                    <span>${estado.cantidad} facturas</span>
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

function actualizarProximosVencimientos() {
  const container = document.getElementById("proximos-vencimientos");
  if (!container) return;

  const proximas = facturas.filter((f) => f.estado === "pending").slice(0, 4);

  container.innerHTML = proximas
    .map(
      (factura) => `
            <div class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div class="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-sm font-medium">${escapeHtml(
                      factura.idFactura
                    )} - ${escapeHtml(factura.cliente)}</h3>
                    <p class="text-xs text-gray-500">Vence: ${calcularFechaVencimiento(
                      factura.fechaEmision
                    )} - Monto: ${formatearMoneda(factura.monto)}</p>
                </div>
                <span class="status-badge status-pending border">Pendiente</span>
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

  // Usar event delegation para el botón de nueva factura
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "btn-nueva-factura" ||
      e.target.closest("#btn-nueva-factura")
    ) {
      mostrarModalCrear();
    }
  });
}

function configurarEventosTabla() {
  const tableBody = document.getElementById("facturas-table-body");
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
      eliminarFactura(id);
    }
  });

  // Configurar filtros
  const filtroEstado = document.getElementById("filtro-estado");
  const filtroCliente = document.getElementById("filtro-cliente");
  const buscarFacturas = document.getElementById("buscar-facturas");

  if (filtroEstado) {
    filtroEstado.addEventListener("change", aplicarFiltros);
  }
  if (filtroCliente) {
    filtroCliente.addEventListener("change", aplicarFiltros);
  }
  if (buscarFacturas) {
    buscarFacturas.addEventListener("input", aplicarFiltros);
  }
}

function aplicarFiltros() {
  const filtroEstado = document.getElementById("filtro-estado")?.value;
  const filtroCliente = document.getElementById("filtro-cliente")?.value;
  const textoBusqueda = document
    .getElementById("buscar-facturas")
    ?.value.toLowerCase();

  let facturasFiltradas = facturas;

  if (filtroEstado) {
    facturasFiltradas = facturasFiltradas.filter(
      (f) => f.estado === filtroEstado
    );
  }

  if (filtroCliente) {
    facturasFiltradas = facturasFiltradas.filter(
      (f) => f.cliente === filtroCliente
    );
  }

  if (textoBusqueda) {
    facturasFiltradas = facturasFiltradas.filter(
      (f) =>
        f.idFactura.toLowerCase().includes(textoBusqueda) ||
        f.cliente.toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarTablaFiltrada(facturasFiltradas);
}

function renderizarTablaFiltrada(facturasFiltradas) {
  const tableBody = document.getElementById("facturas-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = facturasFiltradas
    .map((factura) => renderFilaFactura(factura))
    .join("");
}

// Funciones auxiliares
function formatearMoneda(monto) {
  if (monto >= 1000000) {
    return "$" + (monto / 1000000).toFixed(1) + "M";
  } else if (monto >= 1000) {
    return "$" + (monto / 1000).toFixed(1) + "K";
  }
  return "$" + monto.toLocaleString();
}

function generarOpcionesClientes() {
  const clientes = [...new Set(facturas.map((f) => f.cliente))];
  return clientes
    .map((cliente) => `<option value="${cliente}">${cliente}</option>`)
    .join("");
}

function calcularFechaVencimiento(fechaEmision) {
  // Simular fecha de vencimiento (30 días después)
  const fecha = new Date(fechaEmision.split("/").reverse().join("-"));
  fecha.setDate(fecha.getDate() + 30);
  return fecha.toLocaleDateString("es-ES");
}

function getBadgeEstado(estado) {
  const badges = {
    paid: '<span class="status-badge status-paid border">Pagada</span>',
    pending:
      '<span class="status-badge status-pending border">Pendiente</span>',
    overdue: '<span class="status-badge status-overdue border">Vencida</span>',
    cancelled:
      '<span class="status-badge status-cancelled border">Cancelada</span>',
  };
  return (
    badges[estado] ||
    '<span class="status-badge status-unknown border">Desconocido</span>'
  );
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
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Factura *</label>
                <input type="text" id="create-idFactura" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <input type="text" id="create-cliente" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión *</label>
                    <input type="date" id="create-fechaEmision" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                    <input type="number" id="create-monto" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <select id="create-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="paid">Pagada</option>
                    <option value="pending">Pendiente</option>
                    <option value="overdue">Vencida</option>
                    <option value="cancelled">Cancelada</option>
                </select>
            </div>
        </div>
    `;

  mostrarModal("Nueva Factura", campos, crearFactura);
}

function mostrarModalEditar(id) {
  const factura = facturas.find((f) => f.id === id);
  if (!factura) return;

  // Convertir fecha de dd/mm/yyyy a yyyy-mm-dd para el input date
  const [dia, mes, anio] = factura.fechaEmision.split("/");
  const fechaInput = `${anio}-${mes}-${dia}`;

  const campos = `
        <div class="space-y-4">
            <input type="hidden" id="edit-id" value="${factura.id}">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Factura *</label>
                <input type="text" id="edit-idFactura" value="${escapeHtml(
                  factura.idFactura
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <input type="text" id="edit-cliente" value="${escapeHtml(
                  factura.cliente
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión *</label>
                    <input type="date" id="edit-fechaEmision" value="${fechaInput}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                    <input type="number" id="edit-monto" value="${
                      factura.monto
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <select id="edit-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="paid" ${
                      factura.estado === "paid" ? "selected" : ""
                    }>Pagada</option>
                    <option value="pending" ${
                      factura.estado === "pending" ? "selected" : ""
                    }>Pendiente</option>
                    <option value="overdue" ${
                      factura.estado === "overdue" ? "selected" : ""
                    }>Vencida</option>
                    <option value="cancelled" ${
                      factura.estado === "cancelled" ? "selected" : ""
                    }>Cancelada</option>
                </select>
            </div>
        </div>
    `;

  mostrarModal("Editar Factura", campos, editarFactura);
}

function crearFactura() {
  const idFactura = document.getElementById("create-idFactura")?.value.trim();
  const cliente = document.getElementById("create-cliente")?.value.trim();
  const fechaInput = document.getElementById("create-fechaEmision")?.value;
  const monto = parseFloat(document.getElementById("create-monto")?.value);

  if (!idFactura || !cliente || !fechaInput || isNaN(monto)) {
    mostrarToast("Por favor complete todos los campos obligatorios", "error");
    return;
  }

  // Convertir fecha de yyyy-mm-dd a dd/mm/yyyy
  const [anio, mes, dia] = fechaInput.split("-");
  const fechaEmision = `${dia}/${mes}/${anio}`;

  const nuevaFactura = {
    id: Date.now(),
    idFactura: idFactura,
    cliente: cliente,
    fechaEmision: fechaEmision,
    monto: monto,
    estado: document.getElementById("create-estado")?.value || "pending",
  };

  facturas.push(nuevaFactura);
  guardarFacturas();
  renderizarFacturas();
  ocultarModal();
  mostrarToast("¡Factura creada con éxito!");
}

function editarFactura() {
  const id = parseInt(document.getElementById("edit-id")?.value);
  const facturaIndex = facturas.findIndex((f) => f.id === id);

  if (facturaIndex !== -1) {
    const fechaInput = document.getElementById("edit-fechaEmision")?.value;
    const [anio, mes, dia] = fechaInput.split("-");
    const fechaEmision = `${dia}/${mes}/${anio}`;

    facturas[facturaIndex] = {
      ...facturas[facturaIndex],
      idFactura: document.getElementById("edit-idFactura")?.value.trim() || "",
      cliente: document.getElementById("edit-cliente")?.value.trim() || "",
      fechaEmision: fechaEmision,
      monto: parseFloat(document.getElementById("edit-monto")?.value) || 0,
      estado: document.getElementById("edit-estado")?.value || "pending",
    };

    guardarFacturas();
    renderizarFacturas();
    ocultarModal();
    mostrarToast("¡Factura actualizada con éxito!");
  }
}

function eliminarFactura(id) {
  if (confirm("¿Estás seguro de que quieres eliminar esta factura?")) {
    facturas = facturas.filter((f) => f.id !== id);
    guardarFacturas();
    renderizarFacturas();
    mostrarToast("¡Factura eliminada con éxito!");
  }
}

function guardarFacturas() {
  // Los datos se mantienen en el arreglo facturas en memoria
  // No se usa localStorage, los datos persisten durante la sesión
  console.log("Facturas guardadas en memoria:", facturas.length, "elementos");
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
