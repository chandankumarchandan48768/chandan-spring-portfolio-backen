import axios from 'axios';

// In development the Vite dev-server proxies /api → http://localhost:8080/api
// so we use a relative URL to avoid CORS preflight delays.
// In production, set VITE_API_BASE_URL in .env to your deployed backend URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Fail fast if backend is unreachable (was unlimited before)
  timeout: 10000,
});

// Global request interceptor - attaches JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor – logs errors in one place
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - clearing token');
      localStorage.removeItem('token');
      // If we are not already on the login page (or trying to login), reload to show login screen
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new Event('storage'));
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out – is the Spring backend running on port 8080?');
    } else if (!error.response) {
      console.error('Network error – backend may be down:', error.message);
    }
    return Promise.reject(error);
  }
);

export const educationService = {
  getAll: () => api.get('/education'),
  getById: (id) => api.get(`/education/${id}`),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
  uploadMarksCard: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/education/${id}/upload-marks-card`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadCertificate: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/education/${id}/upload-certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const skillsService = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  uploadCertificate: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/skills/${id}/upload-certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadIcon: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/skills/${id}/upload-icon`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const experienceService = {
  getAll: () => api.get('/experience'),
  getById: (id) => api.get(`/experience/${id}`),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
  uploadCertificate: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/experience/${id}/upload-certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/projects/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const resumeService = {
  getStatus: () => api.get('/resume/status'),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: () => api.delete('/resume')
};

export default api;
