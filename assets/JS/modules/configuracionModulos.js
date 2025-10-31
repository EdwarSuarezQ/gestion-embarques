import { appState } from "../utils/state.js";
import { actualizarSidebarActivo, actualizarTitle } from "../utils/ui.js";

export function mostrarContenidoInicial() {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) {
    console.error("No se encontró #main-content para mostrar inicio");
    return;
  }

  mainContent.innerHTML = `
    <div class="bg-white rounded-lg shadow-sm p-8 text-center">
      
      <section class="py-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
              <i class="fas fa-ship text-6xl text-blue-600 mb-4"></i>

        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          Bienvenido al <span class="text-blue-600">SGTM</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Sistema de Gestión de Transporte Marítimo del Puerto de Buenaventura. 
          Optimiza y controla todas las operaciones portuarias desde una sola plataforma.
        </p>
      </div>

      <!-- Módulos Destacados -->
      <div class="mb-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Tareas -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-blue-300 group cursor-pointer" data-module="tareas">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <i class="fas fa-tasks text-blue-600 text-xl group-hover:text-white"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión de Tareas</h3>
                <p class="text-gray-600 mb-3">Organiza y sigue el progreso de todas las actividades portuarias.</p>
                <span class="inline-flex items-center text-blue-600 font-semibold text-sm">
                  Acceder <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Embarques -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-green-300 group cursor-pointer" data-module="embarques">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <i class="fas fa-shipping-fast text-green-600 text-xl group-hover:text-white"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Control de Embarques</h3>
                <p class="text-gray-600 mb-3">Gestiona embarques, contenedores y documentos de carga.</p>
                <span class="inline-flex items-center text-green-600 font-semibold text-sm">
                  Acceder <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Rutas -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-purple-300 group cursor-pointer" data-module="rutas">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <i class="fas fa-route text-purple-600 text-xl group-hover:text-white"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión de Rutas</h3>
                <p class="text-gray-600 mb-3">Optimiza rutas marítimas y seguimiento de embarcaciones.</p>
                <span class="inline-flex items-center text-purple-600 font-semibold text-sm">
                  Acceder <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Personal -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-orange-300 group cursor-pointer" data-module="personal">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <i class="fas fa-users text-orange-600 text-xl group-hover:text-white"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión de Personal</h3>
                <p class="text-gray-600 mb-3">Administra empleados, turnos y asignaciones.</p>
                <span class="inline-flex items-center text-orange-600 font-semibold text-sm">
                  Acceder <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Embarcaciones -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-teal-300 group cursor-pointer" data-module="embarcaciones">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <i class="fas fa-anchor text-teal-600 text-xl group-hover:text-white"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Embarcaciones</h3>
                <p class="text-gray-600 mb-3">Control de flota, mantenimiento y certificaciones.</p>
                <span class="inline-flex items-center text-teal-600 font-semibold text-sm">
                  Acceder <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-red-300 group cursor-pointer" data-module="estadisticas">
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <i class="fas fa-chart-line text-red-600 text-xl group-hover:text-white"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Estadísticas</h3>
                <p class="text-gray-600 mb-3">Reportes y análisis de operaciones portuarias.</p>
                <span class="inline-flex items-center text-red-600 font-semibold text-sm">
                  Acceder <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

    </div>
  `;

  appState.moduloActual = null;
  actualizarSidebarActivo(null);
  actualizarTitle("inicio");
  window.location.hash = "inicio";
}
