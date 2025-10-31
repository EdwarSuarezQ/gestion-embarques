import { appState } from "./state.js";

export function actualizarSidebarActivo(moduleName) {
  const links = document.querySelectorAll(".module-link, [data-module]");
  links.forEach((link) => {
    link.classList.remove("active", "bg-blue-700");
    if (link.dataset && link.dataset.module === moduleName) {
      link.classList.add("active", "bg-blue-700");
    }
  });

  if (!moduleName) {
    const inicioLink = document.querySelector('[data-module="inicio"]');
    if (inicioLink) inicioLink.classList.add("active", "bg-blue-700");
  }
}

export function actualizarTitle(moduleName) {
  const titles = {
    inicio: "Inicio",
    tareas: "Gestión de Tareas",
    embarques: "Control de Embarques",
    rutas: "Gestión de Rutas",
    facturas: "Facturación",
    personal: "Gestión de Personal",
    embarcaciones: "Embarcaciones",
    almacen: "Almacenes",
    estadisticas: "Estadísticas",
    "exportar-datos": "Exportar Datos",
  };
  const title = titles[moduleName] || "SGTM Buenaventura";
  document.title = `${title} - SGTM Buenaventura`;
}

export function toggleSidebar(forceState = null) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const nuevoEstado =
    forceState !== null ? forceState : !appState.sidebarAbierto;
  appState.sidebarAbierto = nuevoEstado;

  if (window.innerWidth >= 768) {
    if (nuevoEstado) {
      sidebar.classList.remove("collapsed");
      sidebar.classList.remove("w-16");
      sidebar.classList.add("w-64");
    } else {
      sidebar.classList.add("collapsed");
      sidebar.classList.remove("w-64");
      sidebar.classList.add("w-16");
    }
  } else {
    if (nuevoEstado) {
      sidebar.classList.remove("hidden");
    } else {
      sidebar.classList.add("hidden");
    }
  }
}

export function mostrarErrorGlobal(mensaje) {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;
  mainContent.innerHTML = `
    <div class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
        <h3 class="text-lg font-semibold text-red-800">Error</h3>
      </div>
      <p class="mt-2 text-red-600">${mensaje}</p>
      <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
        Recargar aplicación
      </button>
    </div>
  `;
}
