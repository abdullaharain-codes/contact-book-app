import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// ── Request interceptor — attach JWT token ─────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — unwrap data ─────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If 401 — token expired or invalid, clear and redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Contacts API ───────────────────────────────────────────
export const getContacts         = (params)       => api.get('/contacts/', { params });
export const getContact          = (id)           => api.get(`/contacts/${id}`);
export const createContact       = (data)         => api.post('/contacts/', data);
export const updateContact       = (id, data)     => api.put(`/contacts/${id}`, data);
export const deleteContact       = (id)           => api.delete(`/contacts/${id}`);
export const toggleFavorite      = (id)           => api.patch(`/contacts/${id}/favorite`);
export const searchContacts      = (params)       => api.get('/contacts/search', { params });
export const getFavorites        = (params)       => api.get('/contacts/favorites', { params });
export const getContactsByGroup  = (group, params) => api.get(`/contacts/groups/${group}`, { params });
export const getStats            = ()             => api.get('/contacts/stats');

// ── Auth API ───────────────────────────────────────────────
export const registerUser        = (data)         => api.post('/auth/register', data);
export const loginUser           = (data)         => api.post('/auth/login', data);
export const getMe               = ()             => api.get('/auth/me');
export const logoutUser          = ()             => api.post('/auth/logout');

export default api;