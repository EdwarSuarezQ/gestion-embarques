// assets/JS/utils/gestorEventos.js
import { cargarModulo } from "../modules/gestorModulos.js";
import { toggleSidebar } from "./ui.js";
import { appState, log } from "./state.js";

/**
 * Configura todos los listeners globales (delegación).
 */
export function configurarEventosGlobales() {
  // Delegación de clicks en elementos con data-module
  document.body.addEventListener("click", async (e) => {
    const link = e.target.closest("[data-module]");
    if (!link) return;
    e.preventDefault();

    const moduleName = link.dataset.module;
    log("Click en módulo:", moduleName);

    if (!moduleName) {
      console.warn("Elemento data-module sin valor");
      return;
    }

    await cargarModulo(moduleName, { forceReload: true });
  });

  // Toggle sidebar
  document.addEventListener("click", (e) => {
    if (e.target.closest("#sidebar-toggle")) {
      toggleSidebar();
    }
  });

  // Cerrar sidebar al hacer clic fuera en móvil
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 768 && appState.sidebarAbierto) {
      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById("sidebar-toggle");
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        toggleSidebar(false);
      }
    }
  });

  // Responsive: ajustar estado cuando cambian tamaños
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      toggleSidebar(true);
    } else {
      toggleSidebar(false);
    }
  });

  // Dropdown de perfil (delegación simple)
  document.addEventListener("click", (e) => {
    const dropdownBtn = e.target.closest("#profile-dropdown-btn");
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdownBtn && dropdown) {
      dropdown.classList.toggle("hidden");
    } else if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}
