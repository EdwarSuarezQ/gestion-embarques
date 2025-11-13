import ApiService from "../../assets/JS/utils/apiService.js";

const api = new ApiService();
let metricas = {
  embarquesTotales: 0,
  teusMovilizados: 0,
  embarquesCompletados: 0,
  embarquesTransito: 0,
  embarquesPendientes: 0,
  embarquesRetraso: 0,
  incidentes: 0,
  tareasPendientes: 0,
  tareasCompletadas: 0,
  personalActivo: 0,
  personalTotal: 0,
  tiempoPromedio: "0 días",
  variacionMensual: "+0%",
};

// Función de inicialización que se ejecutará cuando el módulo se cargue
async function inicializarModulo() {
  console.log("Inicializando módulo de estadísticas...");

  // Debug temporal para ver la estructura de la respuesta
  await debugEstructuraRespuesta();

  configurarEventos();
  await cargarDatosReales();
  renderizarEstadisticas();
}

// Función temporal para debug
async function debugEstructuraRespuesta() {
  try {
    const response = await api.get("/estadisticas");
    console.log("🔍 DEBUG - Estructura de respuesta:", {
      response,
      tieneData: !!response.data,
      keys: Object.keys(response),
      tipo: typeof response,
    });

    if (response.data) {
      console.log("🔍 DEBUG - response.data:", response.data);
      console.log("🔍 DEBUG - keys de data:", Object.keys(response.data));
    }
  } catch (error) {
    console.error("❌ Error en debug:", error);
  }
}

async function calcularEmbarquesRetraso() {
  try {
    // Obtener todos los embarques para calcular retrasos
    const response = await api.get("/embarques");
    const embarquesData = response?.data || response;
    const embarques = Array.isArray(embarquesData)
      ? embarquesData
      : embarquesData.items || [];

    let retrasados = 0;
    const ahora = new Date();

    embarques.forEach((embarque) => {
      if (embarque.estado !== "completed") {
        // Convertir fechaEstimada "dd/mm/yyyy - HH:mm" a Date
        const [fechaPart, horaPart] = embarque.fechaEstimada.split(" - ");
        const [dia, mes, anio] = fechaPart.split("/");
        const fechaEstimada = new Date(`${anio}-${mes}-${dia}T${horaPart}`);

        // Si pasó la fecha estimada, está en retraso
        if (fechaEstimada < ahora) {
          retrasados++;
        }
      }
    });

    return retrasados;
  } catch (error) {
    console.error("Error calculando retrasos:", error);
    return 0;
  }
}

async function cargarDatosReales() {
  try {
    console.log("Cargando datos reales desde APIs...");

    const response = await api.get("/estadisticas");
    console.log("📦 Respuesta completa:", response);

    const metricasData = response?.data || response;

    console.log("📊 Datos procesados:", metricasData);

    if (metricasData) {
      // Actualizar métricas del backend
      metricas.embarquesTotales = Number(metricasData.embarquesTotales) || 0;
      metricas.teusMovilizados = Number(metricasData.teusMovilizados) || 0;
      metricas.embarquesCompletados =
        Number(metricasData.embarquesCompletados) || 0;
      metricas.embarquesTransito = Number(metricasData.embarquesTransito) || 0;
      metricas.embarquesPendientes =
        Number(metricasData.embarquesPendientes) || 0;

      // CALCULAR RETRASOS SI NO VIENEN DEL BACKEND
      if (metricasData.embarquesRetraso !== undefined) {
        metricas.embarquesRetraso = Number(metricasData.embarquesRetraso);
      } else {
        // Calcular en frontend si el backend no lo proporciona
        metricas.embarquesRetraso = await calcularEmbarquesRetraso();
      }

      metricas.incidentes = Number(metricasData.incidentes) || 0;
      metricas.tareasPendientes = Number(metricasData.tareasPendientes) || 0;
      metricas.tareasCompletadas = Number(metricasData.tareasCompletadas) || 0;
      metricas.personalActivo = Number(metricasData.personalActivo) || 0;
      metricas.personalTotal = Number(metricasData.personalTotal) || 0;
      metricas.tiempoPromedio = metricasData.tiempoPromedio || "0 días";
      metricas.variacionMensual = metricasData.variacionMensual || "+0%";
    } else {
      console.warn("⚠️ No se recibieron datos válidos del backend");
    }

    console.log("✅ Métricas finales - En retraso:", metricas.embarquesRetraso);
    console.log("✅ Todas las métricas:", metricas);
  } catch (err) {
    console.error("❌ Error cargando datos reales:", err);
    mostrarToast("Error al cargar datos del servidor", "error");
  }
}

function obtenerMetricasEjemplo() {
  // Datos de ejemplo para cuando no hay conexión o hay errores
  return {
    embarquesTotales: 45,
    teusMovilizados: 1280,
    embarquesCompletados: 32,
    embarquesTransito: 8,
    embarquesPendientes: 5,
    incidentes: 2,
    tareasPendientes: 12,
    tareasCompletadas: 28,
    personalActivo: 15,
    personalTotal: 18,
    tiempoPromedio: "3.2 días",
    variacionMensual: "+12.5%",
  };
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarModulo);
} else {
  inicializarModulo();
}

function renderizarEstadisticas() {
  const moduleContent = document.getElementById("module-content");
  if (!moduleContent) {
    console.error("No se encontró el module-content");
    return;
  }

  moduleContent.innerHTML = crearEstructuraCompleta();
  actualizarMetricasEnDOM();
}

function crearEstructuraCompleta() {
  return `
        <div class="estadisticas-module">
            <!-- Métricas principales -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                ${crearTarjetaMetrica(
                  "Embarques Totales",
                  "metric-embarques",
                  "blue",
                  "ship",
                  metricas.embarquesTotales,
                  metricas.variacionMensual
                )}
                ${crearTarjetaMetrica(
                  "TEUs Movilizados",
                  "metric-teus",
                  "green",
                  "box",
                  metricas.teusMovilizados.toLocaleString(),
                  "+8%"
                )}
                ${crearTarjetaMetrica(
                  "Tiempo Promedio",
                  "metric-tiempo",
                  "yellow",
                  "clock",
                  metricas.tiempoPromedio,
                  "-0.3 días",
                  "mejora mensual"
                )}
                ${crearTarjetaMetrica(
                  "Eficiencia",
                  "metric-eficiencia",
                  "red",
                  "chart-line",
                  calcularEficienciaReal(),
                  "+2.1%"
                )}
            </div>

            <!-- Filtros y controles -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-periodo">
                                <option value="mes">Este Mes</option>
                                <option value="trimestre">Este Trimestre</option>
                                <option value="anio">Este Año</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Carga</label>
                            <select class="border border-gray-300 rounded-md px-3 py-2 bg-white" id="filtro-tipo">
                                <option value="todos">Todos los tipos</option>
                                <option value="container">Contenedores</option>
                                <option value="bulk">Granel</option>
                                <option value="liquid">Líquidos</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2" id="btn-reporte">
                            <i class="fas fa-download"></i>
                            Exportar Reporte
                        </button>
                        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2" id="btn-actualizar">
                            <i class="fas fa-sync-alt"></i>
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Gráficos y estadísticas detalladas -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Distribución por estado -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Distribución por Estado</h2>
                    <div class="space-y-4" id="distribucion-estados">
                        ${crearDistribucionEstados()}
                    </div>
                </div>

                <!-- Indicadores clave -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Indicadores Clave</h2>
                    <div class="space-y-4" id="indicadores-clave">
                        ${crearIndicadoresClave()}
                    </div>
                </div>
            </div>

            <!-- Métricas adicionales -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                ${crearTarjetaMetricaSecundaria(
                  "Embarques en Retraso",
                  "metric-retraso",
                  "red",
                  "clock",
                  metricas.embarquesRetraso,
                  "Por resolver"
                )}
                ${crearTarjetaMetricaSecundaria(
                  "Personal Activo",
                  "metric-personal",
                  "purple",
                  "users",
                  `${metricas.personalActivo}/${metricas.personalTotal}`,
                  "Disponible"
                )}
                ${crearTarjetaMetricaSecundaria(
                  "Tasa de Incidentes",
                  "metric-incidentes",
                  "red",
                  "exclamation-triangle",
                  metricas.incidentes,
                  "Por resolver"
                )}
            </div>
        </div>
    `;
}

function crearTarjetaMetrica(
  titulo,
  id,
  color,
  icono,
  valor,
  tendencia,
  textoAdicional = "vs mes anterior"
) {
  return `
        <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-${color}-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-500">${titulo}</p>
                    <h2 class="text-2xl font-bold" id="${id}">${valor}</h2>
                </div>
                <div class="p-2 bg-${color}-100 rounded-md text-${color}-600">
                    <i class="fas fa-${icono}"></i>
                </div>
            </div>
            <div class="mt-2 text-sm">
                <span class="${
                  tendencia.includes("+") || tendencia.includes("-0.3")
                    ? "text-green-600"
                    : "text-red-600"
                }">
                    <i class="fas fa-${
                      tendencia.includes("+")
                        ? "arrow-up"
                        : tendencia.includes("-")
                        ? "arrow-down"
                        : "minus"
                    }"></i>
                    ${tendencia}
                </span>
                ${textoAdicional}
            </div>
        </div>
    `;
}

function crearTarjetaMetricaSecundaria(
  titulo,
  id,
  color,
  icono,
  valor,
  subtitulo
) {
  return `
        <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-${color}-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-500">${titulo}</p>
                    <h2 class="text-xl font-bold" id="${id}">${valor}</h2>
                    <p class="text-xs text-gray-400 mt-1">${subtitulo}</p>
                </div>
                <div class="p-2 bg-${color}-100 rounded-md text-${color}-600">
                    <i class="fas fa-${icono}"></i>
                </div>
            </div>
        </div>
    `;
}

function crearDistribucionEstados() {
  const total = metricas.embarquesTotales;

  // Calcular porcentajes
  const porcentajeCompletados =
    total > 0 ? Math.round((metricas.embarquesCompletados / total) * 100) : 0;
  const porcentajeTransito =
    total > 0 ? Math.round((metricas.embarquesTransito / total) * 100) : 0;
  const porcentajePendientes =
    total > 0 ? Math.round((metricas.embarquesPendientes / total) * 100) : 0;
  const porcentajeRetraso =
    total > 0 ? Math.round((metricas.embarquesRetraso / total) * 100) : 0;

  return `
        <div class="space-y-4">
            <!-- Completados -->
            <div class="estado-item" data-estado="completados">
                <div class="flex justify-between text-sm mb-1">
                    <span class="flex items-center cursor-pointer hover:text-green-600 transition-colors">
                        <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        Completados
                    </span>
                    <span class="font-medium">${metricas.embarquesCompletados} <span class="text-gray-500">(${porcentajeCompletados}%)</span></span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full progress-bar transition-all duration-500" 
                         style="width: ${porcentajeCompletados}%"
                         title="${metricas.embarquesCompletados} embarques completados"></div>
                </div>
            </div>

            <!-- En tránsito -->
            <div class="estado-item" data-estado="transito">
                <div class="flex justify-between text-sm mb-1">
                    <span class="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                        <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        En tránsito
                    </span>
                    <span class="font-medium">${metricas.embarquesTransito} <span class="text-gray-500">(${porcentajeTransito}%)</span></span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full progress-bar transition-all duration-500" 
                         style="width: ${porcentajeTransito}%"
                         title="${metricas.embarquesTransito} embarques en tránsito"></div>
                </div>
            </div>

            <!-- Pendientes -->
            <div class="estado-item" data-estado="pendientes">
                <div class="flex justify-between text-sm mb-1">
                    <span class="flex items-center cursor-pointer hover:text-yellow-600 transition-colors">
                        <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        Pendientes
                    </span>
                    <span class="font-medium">${metricas.embarquesPendientes} <span class="text-gray-500">(${porcentajePendientes}%)</span></span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full progress-bar transition-all duration-500" 
                         style="width: ${porcentajePendientes}%"
                         title="${metricas.embarquesPendientes} embarques pendientes"></div>
                </div>
            </div>

            <!-- En retraso (NUEVO) -->
            <div class="estado-item" data-estado="retraso">
                <div class="flex justify-between text-sm mb-1">
                    <span class="flex items-center cursor-pointer hover:text-red-600 transition-colors">
                        <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        En retraso
                    </span>
                    <span class="font-medium">${metricas.embarquesRetraso} <span class="text-gray-500">(${porcentajeRetraso}%)</span></span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full progress-bar transition-all duration-500" 
                         style="width: ${porcentajeRetraso}%"
                         title="${metricas.embarquesRetraso} embarques en retraso"></div>
                </div>
            </div>

            <!-- Total -->
            <div class="pt-3 border-t border-gray-200">
                <div class="flex justify-between text-sm font-semibold">
                    <span>Total de embarques:</span>
                    <span class="text-blue-600">${total}</span>
                </div>
            </div>
        </div>
    `;
}

// Función para actualizar solo la distribución de estados
function actualizarDistribucionEstados() {
  const distribucionElement = document.getElementById("distribucion-estados");
  if (distribucionElement) {
    distribucionElement.innerHTML = crearDistribucionEstados();
    // Re-configurar eventos después de actualizar
    configurarEventosDistribucion();
  }
}

// Configurar eventos interactivos para la distribución
function configurarEventosDistribucion() {
  // Eventos para los items de estado
  document.querySelectorAll(".estado-item").forEach((item) => {
    item.addEventListener("click", function () {
      const estado = this.getAttribute("data-estado");
      filtrarPorEstado(estado);
    });
  });

  // Eventos para las barras de progreso (animación)
  const progressBars = document.querySelectorAll(".progress-bar");
  progressBars.forEach((bar) => {
    // Animar la barra al cargar
    const width = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

// Función para filtrar por estado específico
function filtrarPorEstado(estado) {
  const estadosMap = {
    completados: "completado",
    transito: "transito",
    pendientes: "pendiente",
    retraso: "retraso",
  };

  const estadoFiltro = estadosMap[estado];

  if (estadoFiltro) {
    mostrarToast(`Filtrando por: ${estado}`, "info");
    console.log(`Filtrando embarques por estado: ${estadoFiltro}`);
  }
}

function crearIndicadoresClave() {
  const teusPromedio =
    metricas.embarquesTotales > 0
      ? (metricas.teusMovilizados / metricas.embarquesTotales).toFixed(1)
      : 0;

  const incidentesPorcentaje =
    metricas.embarquesTotales > 0
      ? ((metricas.incidentes / metricas.embarquesTotales) * 100).toFixed(1)
      : 0;

  const eficienciaTareas =
    metricas.tareasPendientes + metricas.tareasCompletadas > 0
      ? (
          (metricas.tareasCompletadas /
            (metricas.tareasPendientes + metricas.tareasCompletadas)) *
          100
        ).toFixed(1)
      : 0;

  return `
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div class="text-sm font-medium text-gray-700">Tasa de éxito</div>
        <div class="text-xs text-gray-500">Embarques sin incidentes</div>
      </div>
      <div class="text-lg font-bold text-green-600">${calcularEficienciaReal()}</div>
    </div>
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div class="text-sm font-medium text-gray-700">TEUs promedio</div>
        <div class="text-xs text-gray-500">Por embarque</div>
      </div>
      <div class="text-lg font-bold text-blue-600">${teusPromedio}</div>
    </div>
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div class="text-sm font-medium text-gray-700">Eficiencia tareas</div>
        <div class="text-xs text-gray-500">Tareas completadas</div>
      </div>
      <div class="text-lg font-bold text-purple-600">${eficienciaTareas}%</div>
    </div>
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div class="text-sm font-medium text-gray-700">Tasa de incidentes</div>
        <div class="text-xs text-gray-500">Por cada 100 embarques</div>
      </div>
      <div class="text-lg font-bold text-red-600">${incidentesPorcentaje}%</div>
    </div>
  `;
}

function actualizarMetricasEnDOM() {
  actualizarElemento("metric-embarques", metricas.embarquesTotales);
  actualizarElemento("metric-teus", metricas.teusMovilizados.toLocaleString());
  actualizarElemento("metric-tiempo", metricas.tiempoPromedio);
  actualizarElemento("metric-eficiencia", calcularEficienciaReal());
  actualizarElemento("metric-retraso", metricas.embarquesRetraso); // NUEVO
  actualizarElemento(
    "metric-personal",
    `${metricas.personalActivo}/${metricas.personalTotal}`
  );
  actualizarElemento("metric-incidentes", metricas.incidentes);
}

function actualizarElemento(selector, valor) {
  const elemento = document.getElementById(selector);
  if (elemento) elemento.textContent = valor;
}

function configurarEventos() {
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "btn-actualizar" ||
      e.target.closest("#btn-actualizar")
    ) {
      actualizarDatos();
    }
    if (e.target.id === "btn-reporte" || e.target.closest("#btn-reporte")) {
      generarReporte();
    }
  });

  const filtroPeriodo = document.getElementById("filtro-periodo");
  const filtroTipo = document.getElementById("filtro-tipo");

  if (filtroPeriodo) filtroPeriodo.addEventListener("change", aplicarFiltros);
  if (filtroTipo) filtroTipo.addEventListener("change", aplicarFiltros);

  // Configurar eventos de distribución después de renderizar
  setTimeout(() => {
    configurarEventosDistribucion();
  }, 100);
}

async function aplicarFiltros() {
  const periodo = document.getElementById("filtro-periodo")?.value;
  const tipo = document.getElementById("filtro-tipo")?.value;

  console.log("🎯 Aplicando filtros:", { periodo, tipo });
  mostrarToast("Aplicando filtros...", "info");

  try {
    let response;

    // SOLO usar el endpoint básico por ahora
    // Los filtros avanzados requieren backend adicional
    response = await api.get("/estadisticas");

    console.log("📦 Respuesta completa:", response);

    // ✅ CORREGIDO: Acceder a response.data si existe
    const metricasData = response?.data || response;

    console.log("📊 Datos procesados del filtro:", metricasData);

    if (metricasData) {
      // Actualizar métricas principales
      metricas.embarquesTotales = Number(metricasData.embarquesTotales) || 0;
      metricas.teusMovilizados = Number(metricasData.teusMovilizados) || 0;
      metricas.embarquesCompletados =
        Number(metricasData.embarquesCompletados) || 0;
      metricas.embarquesTransito = Number(metricasData.embarquesTransito) || 0;
      metricas.embarquesPendientes =
        Number(metricasData.embarquesPendientes) || 0;
      metricas.embarquesRetraso = Number(metricasData.embarquesRetraso) || 0; // NUEVO
      metricas.incidentes = Number(metricasData.incidentes) || 0;

      // Mantener estos valores por defecto si no vienen del backend
      metricas.tareasPendientes = Number(metricasData.tareasPendientes) || 0;
      metricas.tareasCompletadas = Number(metricasData.tareasCompletadas) || 0;
      metricas.personalActivo = Number(metricasData.personalActivo) || 0;
      metricas.personalTotal = Number(metricasData.personalTotal) || 0;
      metricas.tiempoPromedio = metricasData.tiempoPromedio || "0 días";
      metricas.variacionMensual = metricasData.variacionMensual || "+0%";
    } else {
      throw new Error("Respuesta inválida del servidor");
    }

    console.log("✅ Métricas actualizadas después de filtro:", metricas);

    // Actualizar la interfaz
    actualizarMetricasEnDOM();
    actualizarDistribucionEstados();

    const indicadores = document.getElementById("indicadores-clave");
    if (indicadores) indicadores.innerHTML = crearIndicadoresClave();

    mostrarToast(
      `Datos actualizados: ${getTextoPeriodo(periodo)} - ${getTextoTipo(tipo)}`,
      "success"
    );
  } catch (error) {
    console.error("❌ Error aplicando filtros:", error);
    console.error("🔍 Detalles del error:", error);
    mostrarToast("Los filtros avanzados no están disponibles aún", "warning");
  }
}

function getTextoPeriodo(periodo) {
  const periodos = {
    mes: "Este Mes",
    trimestre: "Este Trimestre",
    anio: "Este Año",
  };
  return periodos[periodo] || periodo;
}

function getTextoTipo(tipo) {
  const tipos = {
    todos: "Todos los tipos",
    container: "Contenedores",
    bulk: "Granel",
    liquid: "Líquidos",
  };
  return tipos[tipo] || tipo;
}

async function actualizarDatos() {
  mostrarToast("Actualizando datos...", "info");
  try {
    await cargarDatosReales();
    actualizarMetricasEnDOM();
    actualizarDistribucionEstados();

    const indicadores = document.getElementById("indicadores-clave");
    if (indicadores) indicadores.innerHTML = crearIndicadoresClave();

    mostrarToast("Datos actualizados correctamente", "success");
  } catch (error) {
    console.error("Error actualizando datos:", error);
    mostrarToast("Error al actualizar datos", "error");
  }
}

function generarReporte() {
  const contenido =
    `Reporte de Estadísticas - ${new Date().toLocaleDateString()}\n\n` +
    `=== EMBARQUES ===\n` +
    `Embarques Totales: ${metricas.embarquesTotales}\n` +
    `TEUs Movilizados: ${metricas.teusMovilizados}\n` +
    `Completados: ${metricas.embarquesCompletados}\n` +
    `En tránsito: ${metricas.embarquesTransito}\n` +
    `Pendientes: ${metricas.embarquesPendientes}\n` +
    `Tiempo Promedio: ${metricas.tiempoPromedio}\n\n` +
    `=== TAREAS ===\n` +
    `Tareas Completadas: ${metricas.tareasCompletadas}\n` +
    `Tareas Pendientes: ${metricas.tareasPendientes}\n` +
    `Eficiencia Tareas: ${calcularEficienciaTareas()}%\n\n` +
    `=== PERSONAL ===\n` +
    `Personal Total: ${metricas.personalTotal}\n` +
    `Personal Activo: ${metricas.personalActivo}\n\n` +
    `=== INDICADORES ===\n` +
    `Eficiencia General: ${calcularEficienciaReal()}\n` +
    `Incidentes: ${metricas.incidentes}\n` +
    `Tasa de Incidentes: ${calcularTasaIncidentes()}%\n\n` +
    `Generado el: ${new Date().toLocaleString()}`;

  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `reporte_estadisticas_${
    new Date().toISOString().split("T")[0]
  }.txt`;
  enlace.click();
  URL.revokeObjectURL(url);
  mostrarToast("Reporte generado exitosamente", "success");
}

function calcularEficienciaReal() {
  if (!metricas.embarquesTotales || metricas.embarquesTotales === 0)
    return "0%";
  const eficiencia =
    ((metricas.embarquesTotales - (metricas.incidentes || 0)) /
      metricas.embarquesTotales) *
    100;
  return eficiencia.toFixed(1) + "%";
}

function calcularEficienciaTareas() {
  const totalTareas = metricas.tareasPendientes + metricas.tareasCompletadas;
  if (totalTareas === 0) return 0;
  return ((metricas.tareasCompletadas / totalTareas) * 100).toFixed(1);
}

function calcularTasaIncidentes() {
  if (!metricas.embarquesTotales || metricas.embarquesTotales === 0) return 0;
  return ((metricas.incidentes / metricas.embarquesTotales) * 100).toFixed(1);
}

// Toast
function mostrarToast(mensaje, tipo = "info") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  if (!toast || !toastMessage) return;
  toastMessage.textContent = mensaje;
  toast.className = "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50";
  if (tipo === "success") toast.classList.add("bg-green-500", "text-white");
  else if (tipo === "error") toast.classList.add("bg-red-500", "text-white");
  else if (tipo === "info") toast.classList.add("bg-blue-500", "text-white");
  else toast.classList.add("bg-gray-500", "text-white");
  toast.classList.remove("hidden");
  setTimeout(ocultarToast, 3000);
}

function ocultarToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  const toastClose = document.getElementById("toast-close");
  if (toastClose) toastClose.addEventListener("click", ocultarToast);
});
