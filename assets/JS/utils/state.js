export const DEBUG = true;

export const appState = {
  moduloActual: null,
  sidebarAbierto: window.innerWidth >= 768,
  isLoadingModule: false,
};

export function log(...args) {
  if (DEBUG) console.log("[APP]", ...args);
}
