import axios from 'axios';

const API_URL = 'https://job-tracker-2j1f.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/Auth/register', data),
  login: (data) => api.post('/Auth/login', data)
};

export const jobs = {
  getAll: () => api.get('/User/allApplication'), 
  create: (data) => api.post('/User/saveApplication', data),  
  updateStatus: (id, status) => api.post(`/User/updateApplication/${id}`, { status }),  
  delete: (id) => api.delete(`/User/deleteApplication/${id}`)  
};

export const dashboard = {
  getStats: () => api.get('/DashBoard/Stats') 
};

export default api;
