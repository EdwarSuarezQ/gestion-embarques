export async function cargarComponentes(componentes) {
  const promises = componentes.map(async (comp) => {
    const container = document.getElementById(comp.id);
    if (!container) {
      console.warn(`⚠️ Contenedor ${comp.id} no encontrado`);
      return;
    }

    try {
      const response = await fetch(comp.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const html = await response.text();
      container.innerHTML = html;

      console.log(`✅ Componente ${comp.id} cargado correctamente`);
    } catch (error) {
      console.error(`❌ Error cargando componente ${comp.id}:`, error);
      container.innerHTML = `
        <div class="p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
            <span class="text-red-700">Error cargando componente: ${error.message}</span>
          </div>
        </div>
      `;
    }
  });

  await Promise.all(promises);
}
