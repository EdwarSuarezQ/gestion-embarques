import { cargarComponentes } from "./utils/cargadorComponentes.js";
import { configurarEventosGlobales } from "./utils/gestorEventos.js";
import { cargarModulo } from "./modules/gestorModulos.js";
import { mostrarContenidoInicial } from "./modules/configuracionModulos.js";
import { log } from "./utils/state.js";
import { mostrarErrorGlobal } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  log("Inicializando SGTM Buenaventura...");

  try {
    await cargarComponentes([
      { id: "navbar-container", url: "./components/navbar.html" },
      { id: "sidebar-container", url: "./components/sidebar.html" },
      { id: "footer-container", url: "./components/footer.html" },
    ]);

    configurarEventosGlobales();

    const moduloInicial = window.location.hash.replace("#", "");
    if (moduloInicial) {
      await cargarModulo(moduloInicial, { forceReload: true });
    } else {
      mostrarContenidoInicial();
    }

    log("Aplicación inicializada correctamente");
  } catch (error) {
    console.error("Error inicializando la aplicación:", error);
    mostrarErrorGlobal("Error al cargar la aplicación");
  }
});
