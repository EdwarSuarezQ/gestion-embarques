import { appState, log } from "../utils/state.js";
import {
  actualizarSidebarActivo,
  actualizarTitle,
  mostrarErrorGlobal,
} from "../utils/ui.js";
import { mostrarContenidoInicial } from "./configuracionModulos.js";

export async function cargarModulo(moduleName, { forceReload = true } = {}) {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) {
    console.error("No se encontró #main-content en el DOM");
    return;
  }

  if (!moduleName || moduleName === "inicio") {
    mostrarContenidoInicial();
    return;
  }

  if (appState.isLoadingModule) {
    log(`(ignored) Ya se está cargando un módulo: ${appState.moduloActual}`);
    return;
  }

  appState.isLoadingModule = true;
  try {
    log(`Cargando módulo: ${moduleName} (forceReload=${forceReload})`);

    mainContent.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p class="text-gray-600">Cargando módulo ${moduleName}...</p>
        </div>
      </div>
    `;

    const ts = forceReload ? `?ts=${Date.now()}` : "";
    const urlHtml = `./modules/${moduleName}/${moduleName}.html${ts}`;
    log("fetch ->", urlHtml);

    const response = await fetch(urlHtml, { cache: "no-store" });
    if (!response.ok)
      throw new Error(
        `Módulo ${moduleName} no encontrado (HTTP ${response.status})`
      );

    const html = await response.text();
    mainContent.innerHTML = html;

    appState.moduloActual = moduleName;
    actualizarSidebarActivo(moduleName);
    actualizarTitle(moduleName);
    window.location.hash = moduleName;

    await cargarScriptModulo(moduleName, { forceReload });
    log(`Módulo ${moduleName} cargado correctamente`);
  } catch (error) {
    console.error(`Error cargando módulo ${moduleName}:`, error);
    mostrarErrorGlobal(error.message);
  } finally {
    appState.isLoadingModule = false;
  }
}

export async function cargarScriptModulo(
  moduleName,
  { forceReload = true } = {}
) {
  try {
    const prev = Array.from(
      document.querySelectorAll(`[id^="script-${moduleName}"]`)
    );
    if (prev.length) {
      log(`Eliminando ${prev.length} script(s) previos para ${moduleName}`);
      prev.forEach((s) => s.remove());
    }

    const ts = forceReload ? `?ts=${Date.now()}` : "";
    const scriptId = `script-${moduleName}-${Date.now()}`;
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "module";
    script.src = `./modules/${moduleName}/${moduleName}.js${ts}`;

    script.onerror = () => {
      console.warn(
        `Script del módulo ${moduleName} no encontrado o falló su carga.`
      );
    };

    document.body.appendChild(script);
    log(`Script agregado: ${script.src} (id=${scriptId})`);
  } catch (error) {
    console.warn(`Error cargando script del módulo ${moduleName}:`, error);
  }
}
