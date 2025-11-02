let metricas = obtenerMetricasReales();

// Función de inicialización que se ejecutará cuando el módulo se cargue
function inicializarModulo() {
  console.log("Inicializando módulo...");
  // Mover el contenido de inicializar aquí

  renderizarEstadisticas();
  configurarEventos();
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarModulo);
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  inicializarModulo();
}

function obtenerMetricasReales() {
  const embarques = [];
  const tareas = [];
  const personal = [];

  return {
    embarquesTotales: embarques.length,
    teusMovilizados: embarques.reduce((acc, e) => acc + (e.teus || 0), 0),
    embarquesCompletados: embarques.filter((e) => e.estado === "completado")
      .length,
    embarquesTransito: embarques.filter((e) => e.estado === "transito").length,
    embarquesPendientes: embarques.filter((e) => e.estado === "pendiente")
      .length,
    incidentes: embarques.filter((e) => e.incidente).length,

    // ejemplos adicionales
    tareasPendientes: tareas.filter((t) => t.estado === "pendiente").length,
    tareasCompletadas: tareas.filter((t) => t.estado === "completado").length,

    personalActivo: personal.filter((p) => p.estado === "activo").length,
    personalTotal: personal.length,

    tiempoPromedio: calcularTiempoPromedio(embarques),
    variacionMensual: "+0%", // aquí podrías calcular real
  };
}

function calcularTiempoPromedio(embarques) {
  if (!embarques || embarques.length === 0) return "0 días";
  const totalDias = embarques.reduce(
    (acc, e) => acc + (parseFloat(e.dias) || 0),
    0
  );
  return (totalDias / embarques.length).toFixed(1) + " días";
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
                  calcularEficiencia(),
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

function crearDistribucionEstados() {
  const total = metricas.embarquesTotales;
  const porcentajeCompletados =
    total > 0 ? Math.round((metricas.embarquesCompletados / total) * 100) : 0;
  const porcentajeTransito =
    total > 0 ? Math.round((metricas.embarquesTransito / total) * 100) : 0;
  const porcentajePendientes =
    total > 0 ? Math.round((metricas.embarquesPendientes / total) * 100) : 0;

  return `
        <div>
            <div class="flex justify-between text-sm mb-1">
                <span class="flex items-center">
                    <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Completados
                </span>
                <span>${metricas.embarquesCompletados} (${porcentajeCompletados}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full progress-bar" style="width: ${porcentajeCompletados}%"></div>
            </div>
        </div>
        <div>
            <div class="flex justify-between text-sm mb-1">
                <span class="flex items-center">
                <span class="w-3 h-3 bg-blue-500 rounded-full mr-2">
                </span>En tránsito</span>
                <span>${metricas.embarquesTransito} (${porcentajeTransito}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full progress-bar" style="width: ${porcentajeTransito}%"></div>
            </div>
        </div>
        <div>
            <div class="flex justify-between text-sm mb-1">
                <span class="flex items-center">
                    <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    Pendientes
                </span>
                <span>${metricas.embarquesPendientes} (${porcentajePendientes}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full progress-bar" style="width: ${porcentajePendientes}%"></div>
            </div>
        </div>
    `;
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

  return `
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div class="text-sm font-medium text-gray-700">Tasa de éxito</div>
        <div class="text-xs text-gray-500">Embarques sin incidentes</div>
      </div>
      <div class="text-lg font-bold text-green-600">${calcularEficiencia()}</div>
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
        <div class="text-sm font-medium text-gray-700">Tasa de incidentes</div>
        <div class="text-xs text-gray-500">Por cada 100 embarques</div>
      </div>
      <div class="text-lg font-bold text-red-600">${incidentesPorcentaje}%</div>
    </div>
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div class="text-sm font-medium text-gray-700">Tiempo promedio</div>
        <div class="text-xs text-gray-500">Operación completa</div>
      </div>
      <div class="text-lg font-bold text-yellow-600">${
        metricas.tiempoPromedio || "0 días"
      }</div>
    </div>
  `;
}

function actualizarMetricasEnDOM() {
  actualizarElemento("metric-embarques", metricas.embarquesTotales);
  actualizarElemento("metric-teus", metricas.teusMovilizados.toLocaleString());
  actualizarElemento("metric-tiempo", metricas.tiempoPromedio);
  actualizarElemento("metric-eficiencia", calcularEficiencia());
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
}

function aplicarFiltros() {
  const periodo = document.getElementById("filtro-periodo")?.value;
  const tipo = document.getElementById("filtro-tipo")?.value;

  console.log("Aplicando filtros:", { periodo, tipo });

  // Recalcular métricas filtradas
  simularCambioPorFiltros(periodo, tipo);

  // Actualizar tarjetas principales
  actualizarMetricasEnDOM();

  // 🔥 Re-renderizar Distribución e Indicadores
  const distribucion = document.getElementById("distribucion-estados");
  if (distribucion) distribucion.innerHTML = crearDistribucionEstados();

  const indicadores = document.getElementById("indicadores-clave");
  if (indicadores) indicadores.innerHTML = crearIndicadoresClave();

  mostrarToast(
    `Filtros aplicados: ${getTextoPeriodo(periodo)} - ${getTextoTipo(tipo)}`,
    "info"
  );
}

function simularCambioPorFiltros(periodo, tipo) {
  // Aquí puedes aplicar lógica real.
  // Por ahora solo afectamos un poco las métricas para ver cambios:
  const factor = tipo === "container" ? 1.2 : tipo === "bulk" ? 0.8 : 1;
  metricas.embarquesCompletados = Math.round(
    metricas.embarquesCompletados * factor
  );
  metricas.embarquesPendientes = Math.round(
    metricas.embarquesPendientes * factor
  );
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

function actualizarDatos() {
  mostrarToast("Actualizando datos...", "info");
  setTimeout(() => {
    generarNuevosDatos();
    guardarMetricas();
    actualizarMetricasEnDOM();
    // También refrescamos las secciones
    document.getElementById("distribucion-estados").innerHTML =
      crearDistribucionEstados();
    document.getElementById("indicadores-clave").innerHTML =
      crearIndicadoresClave();
    mostrarToast("Datos actualizados correctamente", "success");
  }, 1000);
}

function generarNuevosDatos() {
  const cambio = Math.random() * 0.2 - 0.1;
  metricas.embarquesTotales = Math.max(
    1,
    Math.round(metricas.embarquesTotales * (1 + cambio))
  );
  metricas.teusMovilizados = Math.max(
    1,
    Math.round(metricas.teusMovilizados * (1 + cambio))
  );
  metricas.incidentes = Math.max(
    0,
    Math.round(metricas.incidentes * (1 + cambio))
  );
  metricas.embarquesCompletados = Math.round(metricas.embarquesTotales * 0.85);
  metricas.embarquesTransito = Math.round(metricas.embarquesTotales * 0.1);
  metricas.embarquesPendientes =
    metricas.embarquesTotales -
    metricas.embarquesCompletados -
    metricas.embarquesTransito;
  metricas.variacionMensual =
    cambio > 0
      ? `+${Math.round(cambio * 100)}%`
      : `${Math.round(cambio * 100)}%`;
}

function generarReporte() {
  const contenido =
    `Reporte de Estadísticas - ${new Date().toLocaleDateString()}\n\n` +
    `Embarques Totales: ${metricas.embarquesTotales}\n` +
    `TEUs Movilizados: ${metricas.teusMovilizados}\n` +
    `Tiempo Promedio: ${metricas.tiempoPromedio}\n` +
    `Eficiencia: ${calcularEficiencia()}\n` +
    `Incidentes: ${metricas.incidentes}\n` +
    `Completados: ${metricas.embarquesCompletados}\n` +
    `En tránsito: ${metricas.embarquesTransito}\n` +
    `Pendientes: ${metricas.embarquesPendientes}\n\n` +
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

function guardarMetricas() {
  // Los datos se mantienen en la variable metricas en memoria
  // No se usa localStorage, los datos persisten durante la sesión
  console.log(
    "Métricas guardadas en memoria:",
    Object.keys(metricas).length,
    "indicadores"
  );
}

function calcularEficiencia() {
  if (!metricas.embarquesTotales || metricas.embarquesTotales === 0)
    return "0%";
  const eficiencia =
    ((metricas.embarquesTotales - (metricas.incidentes || 0)) /
      metricas.embarquesTotales) *
    100;
  return eficiencia.toFixed(1) + "%";
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

// La inicialización se maneja automáticamente arriba
