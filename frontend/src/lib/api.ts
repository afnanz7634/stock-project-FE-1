import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export const verifyToken = async (token: string) => {
  const response = await api.post('/auth/verify', { token });
  return response.data;
};

export const getTokenFromLocalstorage = () => {
  return localStorage.getItem('token') || '';  // Adjust the token key as per your app's storage logic
};

// Base axios configuration to include the token in headers
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getTokenFromLocalstorage()}`,
  },
});

export const getStockIndices = async (limit: number = 20) => {
  const response = await axios.get(`${API_BASE_URL}/stock/indices`, {
    params: { limit },
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getStocksnap = async (limit: number = 20) => {
  const response = await axios.get(`${API_BASE_URL}/stock/snap`, {
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getStockQuote = async (symbol: string) => {
  const response = await axios.get(`${API_BASE_URL}/stock/quote/${symbol}`, {
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getStockCandles = async (
  symbol: string,
  resolution: string,
  from: number,
  to: number,
) => {
  const response = await axios.get(`${API_BASE_URL}/stock/candles/${symbol}`, {
    params: { resolution, from, to },
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getStockSnapshot = async (symbol: string) => {
  const response = await axios.get(`${API_BASE_URL}/stock/snapshot/${symbol}`, {
    ...getAuthHeaders(),
  });
  return response.data;
};

export const addAlert = async (
  userId: string,
  alert: {
    symbol: string;
    threshold: number;
    type: 'above' | 'below';
    email: string;
  },
) => {
  const response = await axios.post(`${API_BASE_URL}/alerts`, {
    userId,
    ...alert,
  }, {
    ...getAuthHeaders(),
  });
  return response.data;
};

export const removeAlert = async (userId: string, alertId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/alerts/${alertId}`, {
    data: { userId },
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getUserAlerts = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/alerts?userId=${userId}`, {
    ...getAuthHeaders(),
  });
  return response.data;
};

