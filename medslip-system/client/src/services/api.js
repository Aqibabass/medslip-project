import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Patient APIs (matching backend routes)
export const patientAPI = {
  create: (patientData) => api.post('/patient/create', patientData),
  getTokenDetails: (data) => api.post('/patient/token-details', data),
};

// Payment APIs (matching backend routes)
export const paymentAPI = {
  createOrder: (data) => api.post('/payment/order', data),
  verify: (data) => api.post('/payment/verify', data),
};

// ATM APIs (matching backend routes)
export const atmAPI = {
  validate: (data) => api.post('/atm/validate', data),
  print: (data) => api.post('/atm/print', data),
};

export default api;