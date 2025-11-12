import ApiService from '../../assets/JS/utils/apiService.js';

const api = new ApiService();
let embarques = [];

// Función de inicialización que se ejecutará cuando el módulo se cargue
async function inicializarModulo() {
  console.log('Inicializando módulo...');
  configurarEventosGlobales();
  await cargarEmbarques();
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarModulo);
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  inicializarModulo();
}

// Cargar embarques desde la API
async function cargarEmbarques() {
  try {
    const res = await api.get('/embarques');
    const payload = res && res.data ? res.data : res;
    if (payload && Array.isArray(payload.items)) {
      embarques = payload.items.map(mapServerEmbarque);
    } else if (Array.isArray(payload)) {
      embarques = payload.map(mapServerEmbarque);
    } else {
      embarques = [];
    }
    renderizarEmbarques();
  } catch (err) {
    console.error('Error cargando embarques:', err);
  }
}

function mapServerEmbarque(e) {
  if (!e) return e;
  const copy = Object.assign({}, e);
  if (!copy.id && copy._id) copy.id = copy._id;
  return copy;
}

function renderizarEmbarques() {
  const moduleContent = document.getElementById('module-content');
  if (!moduleContent) {
    console.error('No se encontró el module-content');
    return;
  }

  // Crear estructura completa del módulo
  moduleContent.innerHTML = crearEstructuraCompleta();

  // Renderizar los componentes después de crear la estructura
  setTimeout(() => {
    renderizarTablaEmbarques();
    actualizarEstadisticas();
    configurarEventosTabla();
  }, 100);
}

function crearEstructuraCompleta() {
  const embarquesActivos = embarques.filter(
    (e) => e.estado === 'in-transit',
  ).length;
  const entregasATiempo = calcularEntregasATiempo();
  const teusProcesados = calcularTEUsProcesados();
  const totalEmbarques = embarques.length;
  const porcentajeActivos =
    totalEmbarques > 0
      ? Math.round((embarquesActivos / totalEmbarques) * 100)
      : 0;
  const variacionTeus = calcularVariacionTEUs();

  return `
        <div class="embarques-module">
            <!-- Estadísticas -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Embarques activos</p>
                            <h2 class="text-2xl font-bold">${embarquesActivos}</h2>
                        </div>
                        <div class="p-2 bg-blue-100 rounded-md text-blue-600">
                            <i class="fas fa-shipping-fast"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          porcentajeActivos > 50
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }">
                            <i class="fas ${
                              porcentajeActivos > 50
                                ? 'fa-arrow-up'
                                : 'fa-arrow-down'
                            }"></i> ${porcentajeActivos}%
                        </span>
                        del total
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Entregas a tiempo</p>
                            <h2 class="text-2xl font-bold">${entregasATiempo}%</h2>
                        </div>
                        <div class="p-2 bg-green-100 rounded-md text-green-600">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          entregasATiempo > 80
                            ? 'text-green-600'
                            : 'text-red-600'
                        }">
                            <i class="fas ${
                              entregasATiempo > 80
                                ? 'fa-arrow-up'
                                : 'fa-arrow-down'
                            }"></i> ${entregasATiempo}%
                        </span>
                        tasa de éxito
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">TEUs procesados</p>
                            <h2 class="text-2xl font-bold">${teusProcesados.toLocaleString()}</h2>
                        </div>
                        <div class="p-2 bg-yellow-100 rounded-md text-yellow-600">
                            <i class="fas fa-box"></i>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="${
                          variacionTeus >= 0 ? 'text-green-600' : 'text-red-600'
                        }">
                            <i class="fas ${
                              variacionTeus >= 0
                                ? 'fa-arrow-up'
                                : 'fa-arrow-down'
                            }"></i> ${Math.abs(variacionTeus)}%
                        </span>
                        vs. promedio
                    </div>
                </div>
            </div>

            <!-- Tabla de embarques -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex flex-1 items-center">
                            <div class="relative flex-1 max-w-md">
                                <input type="text" placeholder="Buscar embarques..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" id="buscar-embarques">
                                <div class="absolute left-3 top-2.5 text-gray-400"><i class="fas fa-search"></i></div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div>
                                <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-estado">
                                    <option value="">Todos los estados</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="in-transit">En tránsito</option>
                                    <option value="loading">Cargando</option>
                                    <option value="unloading">Descargando</option>
                                    <option value="completed">Completado</option>
                                </select>
                            </div>
                            <div>
                                <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-carga">
                                    <option value="">Todos los tipos</option>
                                    <option value="container">Contenedores</option>
                                    <option value="bulk">Granel</option>
                                    <option value="liquid">Líquidos</option>
                                    <option value="vehicles">Vehículos</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Embarque</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buque</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen / Destino</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Estimada</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="embarques-table-body" class="bg-white divide-y divide-gray-200">
                            <!-- Los embarques se cargarán aquí dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Paneles inferiores -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow-md p-5">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Embarques por Estado</h2>
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
                        <h2 class="text-lg font-semibold text-gray-800">Próximas Llegadas</h2>
                        <a href="javascript:void(0)" class="text-blue-600 hover:text-blue-800 text-sm">Ver todos</a>
                    </div>
                    <div class="space-y-3" id="proximas-llegadas">
                        <!-- Las próximas llegadas se cargarán dinámicamente -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderizarTablaEmbarques() {
  const tableBody = document.getElementById('embarques-table-body');
  if (!tableBody) {
    console.error('No se encontró el table body para embarques');
    return;
  }

  tableBody.innerHTML = embarques
    .map((embarque) => renderFilaEmbarque(embarque))
    .join('');
}

function renderFilaEmbarque(embarque) {
  return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${escapeHtml(
                  embarque.idEmbarque,
                )}</div>
                <div class="text-sm text-gray-500">TEUs: ${embarque.teus}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(
                  embarque.buque,
                )}</div>
                <div class="text-sm text-gray-500">IMO: ${embarque.imo}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                    ${embarque.origen}
                    <i class="fas fa-long-arrow-alt-right text-gray-400 mx-1"></i>
                    ${embarque.destino}
                </div>
                <div class="text-xs text-gray-500">Distancia: ${
                  embarque.distancia
                }</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
              embarque.fechaEstimada
            }</td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getBadgeTipoCarga(embarque.tipoCarga)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-${
                  embarque.estado
                } border">${getEstadoText(embarque.estado)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-800 mr-3 edit-btn" data-id="${
                  embarque.id
                }">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800 delete-btn" data-id="${
                  embarque.id
                }">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

function actualizarEstadisticas() {
  actualizarEstadisticasEstado();
  actualizarProximasLlegadas();
  actualizarTarjetasEstadisticas();
}

function calcularEntregasATiempo() {
  const completados = embarques.filter((e) => e.estado === 'completed').length;
  const total = embarques.length;
  return total > 0 ? Math.round((completados / total) * 100) : 0;
}

function calcularTEUsProcesados() {
  return embarques.reduce((total, e) => total + (e.teus || 0), 0);
}

function calcularVariacionTEUs() {
  const teusActuales = calcularTEUsProcesados();
  const promedioTeus =
    embarques.length > 0 ? teusActuales / embarques.length : 0;
  const teusPorEmbarque =
    embarques.reduce((sum, e) => sum + e.teus, 0) / embarques.length;

  if (promedioTeus === 0) return 0;
  return Math.round(((teusActuales - promedioTeus) / promedioTeus) * 100);
}

function actualizarTarjetasEstadisticas() {
  const embarquesActivos = embarques.filter(
    (e) => e.estado === 'in-transit',
  ).length;
  const entregasATiempo = calcularEntregasATiempo();
  const teusProcesados = calcularTEUsProcesados();
  const totalEmbarques = embarques.length;
  const porcentajeActivos =
    totalEmbarques > 0
      ? Math.round((embarquesActivos / totalEmbarques) * 100)
      : 0;
  const variacionTeus = calcularVariacionTEUs();

  // Actualizar tarjeta de embarques activos
  const tarjetaActivos = document.querySelector(
    '.bg-white.border-l-4.border-blue-500',
  );
  if (tarjetaActivos) {
    tarjetaActivos.querySelector('h2').textContent = embarquesActivos;
    const porcentajeElement = tarjetaActivos.querySelector('.text-sm span');
    porcentajeElement.className = `${
      porcentajeActivos > 50 ? 'text-green-600' : 'text-yellow-600'
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      porcentajeActivos > 50 ? 'fa-arrow-up' : 'fa-arrow-down'
    }"></i> ${porcentajeActivos}% del total`;
  }

  // Actualizar tarjeta de entregas a tiempo
  const tarjetaEntregas = document.querySelector(
    '.bg-white.border-l-4.border-green-500',
  );
  if (tarjetaEntregas) {
    tarjetaEntregas.querySelector('h2').textContent = `${entregasATiempo}%`;
    const porcentajeElement = tarjetaEntregas.querySelector('.text-sm span');
    porcentajeElement.className = `${
      entregasATiempo > 80 ? 'text-green-600' : 'text-red-600'
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      entregasATiempo > 80 ? 'fa-arrow-up' : 'fa-arrow-down'
    }"></i> ${entregasATiempo}% tasa de éxito`;
  }

  // Actualizar tarjeta de TEUs procesados
  const tarjetaTeus = document.querySelector(
    '.bg-white.border-l-4.border-yellow-500',
  );
  if (tarjetaTeus) {
    tarjetaTeus.querySelector('h2').textContent =
      teusProcesados.toLocaleString();
    const porcentajeElement = tarjetaTeus.querySelector('.text-sm span');
    porcentajeElement.className = `${
      variacionTeus >= 0 ? 'text-green-600' : 'text-red-600'
    }`;
    porcentajeElement.innerHTML = `<i class="fas ${
      variacionTeus >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'
    }"></i> ${Math.abs(variacionTeus)}% vs. promedio`;
  }
}

function actualizarEstadisticasEstado() {
  const container = document.getElementById('estadisticas-estado');
  if (!container) return;

  const estados = {
    'in-transit': {
      nombre: 'En tránsito',
      color: 'blue',
      cantidad: embarques.filter((e) => e.estado === 'in-transit').length,
    },
    completed: {
      nombre: 'Completados',
      color: 'green',
      cantidad: embarques.filter((e) => e.estado === 'completed').length,
    },
    loading: {
      nombre: 'Cargando/Descargando',
      color: 'yellow',
      cantidad: embarques.filter(
        (e) => e.estado === 'loading' || e.estado === 'unloading',
      ).length,
    },
    pending: {
      nombre: 'Pendientes',
      color: 'gray',
      cantidad: embarques.filter((e) => e.estado === 'pending').length,
    },
  };

  const total = embarques.length;

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
                    <span>${estado.cantidad} embarques</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-${
                      estado.color
                    }-500 h-2 rounded-full" style="width: ${
        total > 0 ? (estado.cantidad / total) * 100 : 0
      }%"></div>
                </div>
            </div>
        `,
    )
    .join('');
}

function actualizarProximasLlegadas() {
  const container = document.getElementById('proximas-llegadas');
  if (!container) return;

  const proximos = embarques
    .filter((e) => e.estado === 'in-transit' || e.estado === 'pending')
    .slice(0, 4);

  container.innerHTML = proximos
    .map(
      (embarque) => `
            <div class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <i class="fas fa-ship"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-sm font-medium">${escapeHtml(
                      embarque.idEmbarque,
                    )} - ${escapeHtml(embarque.buque)}</h3>
                    <p class="text-xs text-gray-500">ETA: ${
                      embarque.fechaEstimada
                    } - ${embarque.origen} a ${embarque.destino}</p>
                </div>
                <span class="status-badge status-${
                  embarque.estado
                } border">${getEstadoText(embarque.estado)}</span>
            </div>
        `,
    )
    .join('');
}

function configurarEventosGlobales() {
  // Configurar eventos del modal
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');

  if (modalClose) {
    modalClose.addEventListener('click', ocultarModal);
  }

  if (modalCancel) {
    modalCancel.addEventListener('click', ocultarModal);
  }

  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        ocultarModal();
      }
    });
  }

  // Configurar toast
  const toastClose = document.getElementById('toast-close');
  if (toastClose) {
    toastClose.addEventListener('click', ocultarToast);
  }

  // Usar event delegation para el botón de nuevo embarque
  document.addEventListener('click', function (e) {
    if (
      e.target.id === 'btn-nuevo-embarque' ||
      e.target.closest('#btn-nuevo-embarque')
    ) {
      mostrarModalCrear();
    }
  });
}

function configurarEventosTabla() {
  const tableBody = document.getElementById('embarques-table-body');
  if (!tableBody) return;

  // Usar event delegation para los botones de editar y eliminar
  tableBody.addEventListener('click', (e) => {
    const target = e.target;
    const editBtn = target.closest('.edit-btn');
    const deleteBtn = target.closest('.delete-btn');

    if (editBtn) {
      const id = editBtn.dataset.id;
      mostrarModalEditar(id);
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      eliminarEmbarque(id);
    }
  });

  // Configurar filtros
  const filtroEstado = document.getElementById('filtro-estado');
  const filtroCarga = document.getElementById('filtro-carga');
  const buscarEmbarques = document.getElementById('buscar-embarques');

  if (filtroEstado) {
    filtroEstado.addEventListener('change', aplicarFiltros);
  }
  if (filtroCarga) {
    filtroCarga.addEventListener('change', aplicarFiltros);
  }
  if (buscarEmbarques) {
    buscarEmbarques.addEventListener('input', aplicarFiltros);
  }
}

function aplicarFiltros() {
  const filtroEstado = document.getElementById('filtro-estado')?.value;
  const filtroCarga = document.getElementById('filtro-carga')?.value;
  const textoBusqueda = document
    .getElementById('buscar-embarques')
    ?.value.toLowerCase();

  let embarquesFiltrados = embarques;

  if (filtroEstado) {
    embarquesFiltrados = embarquesFiltrados.filter(
      (e) => e.estado === filtroEstado,
    );
  }

  if (filtroCarga) {
    embarquesFiltrados = embarquesFiltrados.filter(
      (e) => e.tipoCarga === filtroCarga,
    );
  }

  if (textoBusqueda) {
    embarquesFiltrados = embarquesFiltrados.filter(
      (e) =>
        e.idEmbarque.toLowerCase().includes(textoBusqueda) ||
        e.buque.toLowerCase().includes(textoBusqueda) ||
        e.origen.toLowerCase().includes(textoBusqueda) ||
        e.destino.toLowerCase().includes(textoBusqueda),
    );
  }

  renderizarTablaFiltrada(embarquesFiltrados);
}

function renderizarTablaFiltrada(embarquesFiltrados) {
  const tableBody = document.getElementById('embarques-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = embarquesFiltrados
    .map((embarque) => renderFilaEmbarque(embarque))
    .join('');
}

// Funciones auxiliares
function getBadgeTipoCarga(tipo) {
  const badges = {
    container:
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-box mr-1"></i>Contenedores</span>',
    bulk: '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-boxes mr-1"></i>Granel</span>',
    liquid:
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><i class="fas fa-gas-pump mr-1"></i>Líquidos</span>',
    vehicles:
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><i class="fas fa-car mr-1"></i>Vehículos</span>',
  };
  return (
    badges[tipo] ||
    '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Desconocido</span>'
  );
}

function getEstadoText(estado) {
  const estados = {
    pending: 'Pendiente',
    'in-transit': 'En tránsito',
    loading: 'Cargando',
    unloading: 'Descargando',
    completed: 'Completado',
  };
  return estados[estado] || estado;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Funciones para el modal
function mostrarModal(titulo, contenido, callbackConfirmar) {
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalSave = document.getElementById('modal-save');
  const modal = document.getElementById('modal');

  if (!modal || !modalTitle || !modalBody || !modalSave) {
    console.error('Elementos del modal no encontrados');
    return;
  }

  modalTitle.textContent = titulo;
  modalBody.innerHTML = contenido;
  modalSave.onclick = callbackConfirmar;
  modal.classList.remove('hidden');
}

function ocultarModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function mostrarModalCrear() {
  const campos = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Embarque *</label>
                <input type="text" id="create-idEmbarque" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Buque *</label>
                <input type="text" id="create-buque" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
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
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Estimada *</label>
                    <input type="date" id="create-fecha" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">TEUs *</label>
                    <input type="number" id="create-teus" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Carga *</label>
                    <select id="create-tipoCarga" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="container">Contenedores</option>
                        <option value="bulk">Granel</option>
                        <option value="liquid">Líquidos</option>
                        <option value="vehicles">Vehículos</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="create-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="pending">Pendiente</option>
                        <option value="in-transit">En tránsito</option>
                        <option value="loading">Cargando</option>
                        <option value="unloading">Descargando</option>
                        <option value="completed">Completado</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Distancia (nm)</label>
                <input type="text" id="create-distancia" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: 7,500 nm">
            </div>
        </div>
    `;

  mostrarModal('Nuevo Embarque', campos, crearEmbarque);
}

function mostrarModalEditar(id) {
  const embarque = embarques.find((e) => e.id == id || e._id == id);
  if (!embarque) return;

  // Extraer fecha y hora para el input date
  const [fechaPart, horaPart] = embarque.fechaEstimada.split(' - ');
  const [dia, mes, anio] = fechaPart.split('/');
  const fechaInput = `${anio}-${mes}-${dia}`;

  const campos = `
        <div class="space-y-4">
            <input type="hidden" id="edit-id" value="${embarque.id}">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Embarque *</label>
                <input type="text" id="edit-idEmbarque" value="${escapeHtml(
                  embarque.idEmbarque,
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Buque *</label>
                <input type="text" id="edit-buque" value="${escapeHtml(
                  embarque.buque,
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número IMO *</label>
                <input type="text" id="edit-imo" value="${
                  embarque.imo
                }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Origen *</label>
                    <input type="text" id="edit-origen" value="${escapeHtml(
                      embarque.origen,
                    )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
                    <input type="text" id="edit-destino" value="${escapeHtml(
                      embarque.destino,
                    )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Estimada *</label>
                    <input type="date" id="edit-fecha" value="${fechaInput}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">TEUs *</label>
                    <input type="number" id="edit-teus" value="${
                      embarque.teus
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Carga *</label>
                    <select id="edit-tipoCarga" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="container" ${
                          embarque.tipoCarga === 'container' ? 'selected' : ''
                        }>Contenedores</option>
                        <option value="bulk" ${
                          embarque.tipoCarga === 'bulk' ? 'selected' : ''
                        }>Granel</option>
                        <option value="liquid" ${
                          embarque.tipoCarga === 'liquid' ? 'selected' : ''
                        }>Líquidos</option>
                        <option value="vehicles" ${
                          embarque.tipoCarga === 'vehicles' ? 'selected' : ''
                        }>Vehículos</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="edit-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="pending" ${
                          embarque.estado === 'pending' ? 'selected' : ''
                        }>Pendiente</option>
                        <option value="in-transit" ${
                          embarque.estado === 'in-transit' ? 'selected' : ''
                        }>En tránsito</option>
                        <option value="loading" ${
                          embarque.estado === 'loading' ? 'selected' : ''
                        }>Cargando</option>
                        <option value="unloading" ${
                          embarque.estado === 'unloading' ? 'selected' : ''
                        }>Descargando</option>
                        <option value="completed" ${
                          embarque.estado === 'completed' ? 'selected' : ''
                        }>Completado</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Distancia (nm)</label>
                <input type="text" id="edit-distancia" value="${
                  embarque.distancia
                }" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ej: 7,500 nm">
            </div>
        </div>
    `;

  mostrarModal('Editar Embarque', campos, editarEmbarque);
}

function crearEmbarque() {
  const idEmbarque = document.getElementById('create-idEmbarque')?.value.trim();
  const buque = document.getElementById('create-buque')?.value.trim();
  const imo = document.getElementById('create-imo')?.value.trim();
  const origen = document.getElementById('create-origen')?.value.trim();
  const destino = document.getElementById('create-destino')?.value.trim();
  const fechaInput = document.getElementById('create-fecha')?.value;
  const teus = parseInt(document.getElementById('create-teus')?.value);

  if (
    !idEmbarque ||
    !buque ||
    !imo ||
    !origen ||
    !destino ||
    !fechaInput ||
    isNaN(teus)
  ) {
    mostrarToast('Por favor complete todos los campos obligatorios', 'error');
    return;
  }

  // Convertir fecha de yyyy-mm-dd a dd/mm/yyyy - HH:mm
  const [anio, mes, dia] = fechaInput.split('-');
  const fechaEstimada = `${dia}/${mes}/${anio} - 08:30`; // Hora por defecto

  const body = {
    idEmbarque: idEmbarque,
    buque: buque,
    imo: imo,
    origen: origen,
    destino: destino,
    fechaEstimada: fechaEstimada,
    teus: teus,
    tipoCarga:
      document.getElementById('create-tipoCarga')?.value || 'container',
    estado: document.getElementById('create-estado')?.value || 'pending',
    distancia: document.getElementById('create-distancia')?.value || '0 nm',
  };

  api
    .post('/embarques', body)
    .then((res) => {
      const created = res && res.data ? res.data : res;
      embarques.unshift(mapServerEmbarque(created));
      renderizarEmbarques();
      ocultarModal();
      mostrarToast('¡Embarque creado con éxito!');
    })
    .catch((err) => {
      console.error('Error creando embarque', err);
      mostrarToast(err.message || 'Error al crear embarque', 'error');
    });
}

function editarEmbarque() {
  const id = document.getElementById('edit-id')?.value;
  if (!id) return;
  const fechaInput = document.getElementById('edit-fecha')?.value;
  const [anio, mes, dia] = fechaInput.split('-');
  const fechaEstimada = `${dia}/${mes}/${anio} - 08:30`;

  const body = {
    idEmbarque: document.getElementById('edit-idEmbarque')?.value.trim() || '',
    buque: document.getElementById('edit-buque')?.value.trim() || '',
    imo: document.getElementById('edit-imo')?.value.trim() || '',
    origen: document.getElementById('edit-origen')?.value.trim() || '',
    destino: document.getElementById('edit-destino')?.value.trim() || '',
    fechaEstimada: fechaEstimada,
    teus: parseInt(document.getElementById('edit-teus')?.value) || 0,
    tipoCarga: document.getElementById('edit-tipoCarga')?.value || 'container',
    estado: document.getElementById('edit-estado')?.value || 'pending',
    distancia: document.getElementById('edit-distancia')?.value || '0 nm',
  };

  api
    .put(`/embarques/${id}`, body)
    .then((res) => {
      const updated = res && res.data ? res.data : res;
      embarques = embarques.map((e) =>
        e.id == id || e._id == id ? mapServerEmbarque(updated) : e,
      );
      renderizarEmbarques();
      ocultarModal();
      mostrarToast('¡Embarque actualizado con éxito!');
    })
    .catch((err) => {
      console.error('Error actualizando embarque', err);
      mostrarToast(err.message || 'Error al actualizar embarque', 'error');
    });
}

function eliminarEmbarque(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este embarque?')) return;
  api
    .delete(`/embarques/${id}`)
    .then(() => {
      embarques = embarques.filter((e) => e.id != id && e._id != id);
      renderizarEmbarques();
      mostrarToast('¡Embarque eliminado con éxito!');
    })
    .catch((err) => {
      console.error('Error eliminando embarque', err);
      mostrarToast(err.message || 'Error al eliminar embarque', 'error');
    });
}

function guardarEmbarques() {
  // Antes: persistía en memoria. Ahora la persistencia se realiza via API.
  // Mantener placeholder para compatibilidad.
}

// Funciones para toast
function mostrarToast(mensaje, tipo = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = mensaje;

  // Configurar el color según el tipo
  toast.className = 'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50';
  if (tipo === 'success') {
    toast.classList.add('bg-green-500', 'text-white');
  } else if (tipo === 'error') {
    toast.classList.add('bg-red-500', 'text-white');
  }

  // Mostrar el toast
  toast.classList.remove('hidden');

  // Ocultar automáticamente después de 3 segundos
  setTimeout(ocultarToast, 3000);
}

function ocultarToast() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('hidden');
  }
}
