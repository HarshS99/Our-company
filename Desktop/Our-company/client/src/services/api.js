import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('dm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dm_token');
      localStorage.removeItem('dm_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ---- Projects ----
export const fetchProjects = (params) => API.get('/projects', { params });
export const fetchProject = (slug) => API.get(`/projects/${slug}`);
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// ---- Categories ----
export const fetchCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ---- Requests ----
export const submitRequest = (data) => API.post('/requests', data);
export const fetchRequests = (params) => API.get('/requests', { params });
export const fetchRequest = (id) => API.get(`/requests/${id}`);
export const updateRequestStatus = (id, status) => API.patch(`/requests/${id}/status`, { status });
export const deleteRequest = (id) => API.delete(`/requests/${id}`);

// ---- Auth ----
export const login = (credentials) => API.post('/auth/login', credentials);
export const getMe = () => API.get('/auth/me');

export default API;
