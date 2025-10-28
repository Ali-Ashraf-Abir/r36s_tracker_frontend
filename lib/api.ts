import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data: { username: string; email: string; password: string; displayName?: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { displayName?: string; profilePublic?: boolean }) =>
    api.patch('/auth/profile', data),
  regenerateApiKey: () => api.post('/auth/regenerate-api-key'),
};

export const gameplay = {
  getStats: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/gameplay/stats', { params }),
  getPublicProfile: (username: string) =>
    api.get(`/gameplay/public/${username}`),
};

export const backup = {
  list: () => api.get('/backup/list'),
  download: (backupId: string) =>
    api.get(`/backup/download/${backupId}`, { responseType: 'blob' }),
  delete: (backupId: string) => api.delete(`/backup/${backupId}`),
};

export const device = {
  list: () => api.get('/device/list'),
};

export default api;