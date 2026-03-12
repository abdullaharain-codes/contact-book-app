import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ FIXED: interceptor returns response.data directly
// so all functions below get the data, not the full axios response object
api.interceptors.response.use(
  (response) => response.data,  // ← unwrap here once, for ALL requests
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============= CONTACT API FUNCTIONS =============
// Note: no more response.data needed — interceptor already unwraps it

export const getAllContacts = async (params = {}) => {
  return await api.get('/contacts/', { params });
};

export const getContact = async (id) => {
  return await api.get(`/contacts/${id}`);
};

export const createContact = async (formData) => {
  return await api.post('/contacts/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateContact = async (id, formData) => {
  return await api.put(`/contacts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteContact = async (id) => {
  return await api.delete(`/contacts/${id}`);
};

export const searchContacts = async (query, params = {}) => {
  return await api.get('/contacts/search', {
    params: { q: query, ...params },
  });
};

export const toggleFavorite = async (id) => {
  return await api.patch(`/contacts/${id}/favorite`);
};

export const getFavorites = async (params = {}) => {
  return await api.get('/contacts/favorites', { params });
};

// ✅ Group endpoint — returns { contacts: [], pagination: {} }
export const getContactsByGroup = async (group, params = {}) => {
  return await api.get(`/contacts/groups/${group}`, { params });
};

export const getStats = async () => {
  return await api.get('/contacts/stats');
};

export default api;