import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth API
export const authAPI = {
  login: (emailOrPhone) => 
    axios.post(`${API_BASE_URL}/auth/login`, { emailOrPhone }),
  
  verifyOTP: (userId, otp) => 
    axios.post(`${API_BASE_URL}/auth/verify-otp`, { userId, otp }),
  
  resendOTP: (userId) => 
    axios.post(`${API_BASE_URL}/auth/resend-otp`, { userId })
};

// Products API
export const productsAPI = {
  getAll: () => 
    axios.get(`${API_BASE_URL}/products`),
  
  getPublished: () => 
    axios.get(`${API_BASE_URL}/products/published`),
  
  getUnpublished: () => 
    axios.get(`${API_BASE_URL}/products/unpublished`),
  
  create: (formData) => 
    axios.post(`${API_BASE_URL}/products`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id, formData) => 
    axios.put(`${API_BASE_URL}/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  togglePublish: (id) => 
    axios.patch(`${API_BASE_URL}/products/${id}/toggle-publish`),
  
  delete: (id) => 
    axios.delete(`${API_BASE_URL}/products/${id}`)
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const validateEmailOrPhone = (input) => {
  return validateEmail(input) || validatePhone(input);
};