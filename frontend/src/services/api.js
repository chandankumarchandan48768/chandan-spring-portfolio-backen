import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};

export const experienceService = {
  getAll: () => api.get('/experience'),
  getById: (id) => api.get(`/experience/${id}`),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export default api;
