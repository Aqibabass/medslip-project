import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for loading/errors if needed

export const patientAPI = {
  create: (data) => api.post('/patients/create', data),
  getTokenDetails: (data) => api.post('/patients/token-details', data),
};

export const paymentAPI = {
  createOrder: (data) => api.post('/payments/order', data),
  verify: (data) => api.post('/payments/verify', data),
};

export default api;