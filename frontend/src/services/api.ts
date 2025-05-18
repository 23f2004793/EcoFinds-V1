import axios from 'axios';
import { User, Product, Purchase, MongoUser, MongoProduct, MongoPurchase } from '../types/models';

// API base URL would point to our backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecofinds-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User APIs
export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (email: string, password: string, username: string) => {
  const response = await api.post('/auth/register', { email, password, username });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Product APIs
export const getProducts = async (category?: string, searchTerm?: string) => {
  let url = '/products';
  const params: Record<string, string> = {};
  
  if (category && category !== 'all') {
    params.category = category;
  }
  
  if (searchTerm) {
    params.search = searchTerm;
  }
  
  const response = await api.get(url, { params });
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product: Omit<MongoProduct, '_id'>) => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id: string, product: Partial<MongoProduct>) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Purchase APIs
export const getUserPurchases = async () => {
  const response = await api.get('/purchases');
  return response.data;
};

export const createPurchase = async (purchase: Omit<MongoPurchase, '_id'>) => {
  const response = await api.post('/purchases', purchase);
  return response.data;
};

export default api;
