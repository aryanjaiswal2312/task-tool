import axios from 'axios';

/** User-facing message when the backend is unreachable (dev: start backend on port 5000). */
export function getApiErrorMessage(error, fallback = 'Something went wrong.') {
  const msg = error?.response?.data?.message;
  if (msg) return msg;
  if (!error?.response) {
    return 'Cannot reach the server. Start the backend on port 5000 (in the backend folder: npm run dev), then try again.';
  }
  return fallback;
}

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskly_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taskly_token');
      localStorage.removeItem('taskly_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Todos
export const todosAPI = {
  getAll: () => api.get('/todos'),
  create: (data) => api.post('/todos', data),
  update: (id, data) => api.put(`/todos/${id}`, data),
  toggle: (id) => api.patch(`/todos/${id}/toggle`),
  delete: (id) => api.delete(`/todos/${id}`),
  clearCompleted: () => api.delete('/todos/completed/all'),
};

// User
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePassword: (data) => api.put('/user/password', data),
};

export default api;
