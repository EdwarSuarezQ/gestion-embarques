const API_BASE = window?.API_BASE_URL || 'http://localhost:3000/api';

export default class ApiService {
  constructor() {
    this.token = localStorage.getItem('token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = options.headers || {};
    if (!headers['Content-Type'] && !(options.body instanceof FormData))
      headers['Content-Type'] = 'application/json';
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const cfg = Object.assign(
      { method: 'GET', headers, credentials: 'same-origin' },
      options,
    );
    if (
      cfg.body &&
      typeof cfg.body === 'object' &&
      !(cfg.body instanceof FormData)
    )
      cfg.body = JSON.stringify(cfg.body);
    const res = await fetch(url, cfg);
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }
    if (!res.ok) {
      const err = new Error(data?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
  }

  get(endpoint, params) {
    let url = endpoint;
    if (params && typeof params === 'object') {
      const qs = new URLSearchParams(params).toString();
      url += `?${qs}`;
    }
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
