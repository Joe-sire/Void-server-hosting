import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Token is handled via httpOnly cookie, but also support Authorization header as fallback
    const token = localStorage.getItem('session_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Auth API ====================

export const authAPI = {
  createSession: async (sessionId) => {
    const response = await api.post('/auth/session', { session_id: sessionId });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// ==================== Public API ====================

export const publicAPI = {
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data.plans;
  },

  getFeatures: async () => {
    const response = await api.get('/features');
    return response.data.features;
  },

  getFAQs: async () => {
    const response = await api.get('/faqs');
    return response.data.faqs;
  },

  getSiteContent: async () => {
    const response = await api.get('/content');
    return response.data;
  },
};

// ==================== Server API ====================

export const serverAPI = {
  getServers: async () => {
    const response = await api.get('/servers');
    return response.data.servers;
  },

  createServer: async (serverData) => {
    const response = await api.post('/servers', serverData);
    return response.data;
  },

  getServer: async (serverId) => {
    const response = await api.get(`/servers/${serverId}`);
    return response.data;
  },

  updateServer: async (serverId, updates) => {
    const response = await api.put(`/servers/${serverId}`, updates);
    return response.data;
  },

  startServer: async (serverId) => {
    const response = await api.post(`/servers/${serverId}/start`);
    return response.data;
  },

  stopServer: async (serverId) => {
    const response = await api.post(`/servers/${serverId}/stop`);
    return response.data;
  },

  restartServer: async (serverId) => {
    const response = await api.post(`/servers/${serverId}/restart`);
    return response.data;
  },

  getConsoleLogs: async (serverId) => {
    const response = await api.get(`/servers/${serverId}/console`);
    return response.data.logs;
  },

  deleteServer: async (serverId) => {
    const response = await api.delete(`/servers/${serverId}`);
    return response.data;
  },
};

// ==================== Admin API ====================

export const adminAPI = {
  updatePlan: async (planId, updates) => {
    const response = await api.put(`/admin/plans/${planId}`, updates);
    return response.data;
  },

  updateFeature: async (featureId, updates) => {
    const response = await api.put(`/admin/features/${featureId}`, updates);
    return response.data;
  },

  createFAQ: async (faqData) => {
    const response = await api.post('/admin/faqs', faqData);
    return response.data;
  },

  updateFAQ: async (faqId, updates) => {
    const response = await api.put(`/admin/faqs/${faqId}`, updates);
    return response.data;
  },

  deleteFAQ: async (faqId) => {
    const response = await api.delete(`/admin/faqs/${faqId}`);
    return response.data;
  },

  updateSiteContent: async (content) => {
    const response = await api.put('/admin/content', content);
    return response.data;
  },
};

export default api;
