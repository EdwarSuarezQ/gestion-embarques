/**
 * Servicio API para integración con el backend
 * Sin autenticación - acceso público
 */

const API_BASE = 'http://localhost:3000/api';

class ApiService {
  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Si hay body, convertirlo a JSON
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en API request:', error);
      throw error;
    }
  }

  // Tareas
  async getTareas(page = 1, limit = 100, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/tareas?${params}`);
  }

  async getTarea(id) {
    return this.request(`/tareas/${id}`);
  }

  async createTarea(tarea) {
    return this.request('/tareas', {
      method: 'POST',
      body: tarea
    });
  }

  async updateTarea(id, tarea) {
    return this.request(`/tareas/${id}`, {
      method: 'PUT',
      body: tarea
    });
  }

  async patchTarea(id, updates) {
    return this.request(`/tareas/${id}`, {
      method: 'PATCH',
      body: updates
    });
  }

  async deleteTarea(id) {
    return this.request(`/tareas/${id}`, {
      method: 'DELETE'
    });
  }

  async getTareasEstadisticas() {
    return this.request('/tareas/estadisticas');
  }

  // Embarques
  async getEmbarques(page = 1, limit = 100, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/embarques?${params}`);
  }

  async getEmbarque(id) {
    return this.request(`/embarques/${id}`);
  }

  async createEmbarque(embarque) {
    return this.request('/embarques', {
      method: 'POST',
      body: embarque
    });
  }

  async updateEmbarque(id, embarque) {
    return this.request(`/embarques/${id}`, {
      method: 'PUT',
      body: embarque
    });
  }

  async patchEmbarque(id, updates) {
    return this.request(`/embarques/${id}`, {
      method: 'PATCH',
      body: updates
    });
  }

  async deleteEmbarque(id) {
    return this.request(`/embarques/${id}`, {
      method: 'DELETE'
    });
  }

  async getEmbarquesActivos() {
    return this.request('/embarques/activos');
  }

  async getEmbarquesByEstado(estado) {
    return this.request(`/embarques/estado/${estado}`);
  }

  async updateEmbarqueEstado(id, estado) {
    return this.request(`/embarques/${id}/estado`, {
      method: 'PUT',
      body: { estado }
    });
  }

  async getEmbarquesEstadisticas() {
    return this.request('/embarques/estadisticas');
  }

  // Rutas
  async getRutas(page = 1, limit = 100, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/rutas?${params}`);
  }

  async getRuta(id) {
    return this.request(`/rutas/${id}`);
  }

  async createRuta(ruta) {
    return this.request('/rutas', {
      method: 'POST',
      body: ruta
    });
  }

  async updateRuta(id, ruta) {
    return this.request(`/rutas/${id}`, {
      method: 'PUT',
      body: ruta
    });
  }

  async patchRuta(id, updates) {
    return this.request(`/rutas/${id}`, {
      method: 'PATCH',
      body: updates
    });
  }

  async deleteRuta(id) {
    return this.request(`/rutas/${id}`, {
      method: 'DELETE'
    });
  }

  async getRutasActivas() {
    return this.request('/rutas/activas');
  }

  // Facturas
  async getFacturas(page = 1, limit = 100, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/facturas?${params}`);
  }

  async getFactura(id) {
    return this.request(`/facturas/${id}`);
  }

  async createFactura(factura) {
    return this.request('/facturas', {
      method: 'POST',
      body: factura
    });
  }

  async updateFactura(id, factura) {
    return this.request(`/facturas/${id}`, {
      method: 'PUT',
      body: factura
    });
  }

  async patchFactura(id, updates) {
    return this.request(`/facturas/${id}`, {
      method: 'PATCH',
      body: updates
    });
  }

  async deleteFactura(id) {
    return this.request(`/facturas/${id}`, {
      method: 'DELETE'
    });
  }

  async getFacturasPendientes() {
    return this.request('/facturas/pendientes');
  }

  async pagarFactura(id) {
    return this.request(`/facturas/${id}/pagar`, {
      method: 'PUT'
    });
  }

  async getFacturasEstadisticas() {
    return this.request('/facturas/estadisticas');
  }

  // Personal
  async getPersonal(page = 1, limit = 100, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/personal?${params}`);
  }

  async getPersonalById(id) {
    return this.request(`/personal/${id}`);
  }

  async createPersonal(personal) {
    return this.request('/personal', {
      method: 'POST',
      body: personal
    });
  }

  async updatePersonal(id, personal) {
    return this.request(`/personal/${id}`, {
      method: 'PUT',
      body: personal
    });
  }

  async patchPersonal(id, updates) {
    return this.request(`/personal/${id}`, {
      method: 'PATCH',
      body: updates
    });
  }

  async deletePersonal(id) {
    return this.request(`/personal/${id}`, {
      method: 'DELETE'
    });
  }

  async getPersonalActivos() {
    return this.request('/personal/activos');
  }

  // Embarcaciones
  async getEmbarcaciones(page = 1, limit = 100, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/embarcaciones?${params}`);
  }

  async getEmbarcacion(id) {
    return this.request(`/embarcaciones/${id}`);
  }

  async createEmbarcacion(embarcacion) {
    return this.request('/embarcaciones', {
      method: 'POST',
      body: embarcacion
    });
  }

  async updateEmbarcacion(id, embarcacion) {
    return this.request(`/embarcaciones/${id}`, {
      method: 'PUT',
      body: embarcacion
    });
  }

  async patchEmbarcacion(id, updates) {
    return this.request(`/embarcaciones/${id}`, {
      method: 'PATCH',
      body: updates
    });
  }

  async deleteEmbarcacion(id) {
    return this.request(`/embarcaciones/${id}`, {
      method: 'DELETE'
    });
  }

  // Almacenes
  async getAlmacenes(page = 1, limit = 100, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    return this.request(`/almacenes?${params}`);
  }

  async getAlmacen(id) {
    return this.request(`/almacenes/${id}`);
  }

  async createAlmacen(almacen) {
    return this.request('/almacenes', {
      method: 'POST',
      body: almacen
    });
  }

  async updateAlmacen(id, almacen) {
    return this.request(`/almacenes/${id}`, {
      method: 'PUT',
      body: almacen
    });
  }

  async patchAlmacen(id, updates) {
    return this.request(`/almacenes/${id}`, {
      method: 'PATCH',
      body: updates
    });
  }

  async deleteAlmacen(id) {
    return this.request(`/almacenes/${id}`, {
      method: 'DELETE'
    });
  }

  async updateAlmacenOcupacion(id, ocupacion) {
    return this.request(`/almacenes/${id}/ocupacion`, {
      method: 'PUT',
      body: { ocupacion }
    });
  }

  // Estadísticas
  async getEstadisticasGenerales() {
    return this.request('/estadisticas/generales');
  }

  async getEstadisticasDashboard() {
    return this.request('/estadisticas/dashboard');
  }

  async getEstadisticasTendencias() {
    return this.request('/estadisticas/tendencias');
  }

  // Exportación
  async getTiposExportacion() {
    return this.request('/exportar/tipos');
  }

  async generarExportacion(tipo, formato, modulo, campos, filtros = {}) {
    return this.request('/exportar/generar', {
      method: 'POST',
      body: { tipo, formato, modulo, campos, filtros }
    });
  }
}

// Exportar instancia singleton
const apiService = new ApiService();
export default apiService;

