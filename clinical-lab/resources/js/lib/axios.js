import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // ✅ Debe tener /api
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const csrfCookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (csrfCookie) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfCookie[1]);
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

export default api;