import axios from 'axios';
import * as mockApi from '../mock/mockApi';

// ─── Env flag ─────────────────────────────────────────────────────────────────
//  Controlled via .env:
//    VITE_MOCK_MODE=true   → use local dummy data (no backend needed)
//    VITE_MOCK_MODE=false  → call real backend at localhost:8080

const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

// ─── Real Axios instance ──────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (userId) config.headers['X-User-ID'] = userId;
  return config;
});

// ─── Real API functions ───────────────────────────────────────────────────────

const realApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (firstName, lastName, email, password) =>
    api.post('/auth/register', { firstName, lastName, email, password }),
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  getActivities: () => api.get('/activities'),
  addActivity: (activity) => api.post('/activities', activity),
  getActivity: (activityId) => api.get(`/activities/${activityId}`),
  getActivityRecommendation: (activityId) =>
    api.get(`/recommendations/activity/${activityId}`),
  getUserRecommendations: (userId) =>
    api.get(`/recommendations/user/${userId}`),
};

// ─── Exports (mock or real, based on VITE_MOCK_MODE) ─────────────────────────

const {
  login, register, getUserProfile,
  getActivities, addActivity, getActivity,
  getActivityRecommendation, getUserRecommendations,
} = MOCK_MODE ? mockApi : realApi;

export {
  login, register, getUserProfile,
  getActivities, addActivity, getActivity,
  getActivityRecommendation, getUserRecommendations,
};

export default api;
