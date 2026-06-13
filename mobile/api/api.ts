import axios from 'axios';
import SecureStore from '@/utils/storage';
import * as mockApi from '../mock/mockApi';

// ─── Config ───────────────────────────────────────────────────────────────────
const MOCK_MODE = process.env.EXPO_PUBLIC_MOCK_MODE === 'true';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';

// ─── Real Axios instance ──────────────────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  const userId = await SecureStore.getItemAsync('userId');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (userId) config.headers['X-User-ID'] = userId;
  return config;
});

// ─── Real API functions ───────────────────────────────────────────────────────
const realApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (firstName: string, lastName: string, email: string, password: string) =>
    api.post('/auth/register', { firstName, lastName, email, password }),
  getUserProfile: (userId: string) =>
    api.get(`/users/${userId}`),
  getActivities: () =>
    api.get('/activities'),
  addActivity: (activity: object) =>
    api.post('/activities', activity),
  getActivity: (activityId: string) =>
    api.get(`/activities/${activityId}`),
  getActivityRecommendation: (activityId: string) =>
    api.get(`/recommendations/activity/${activityId}`),
  getUserRecommendations: (userId: string) =>
    api.get(`/recommendations/user/${userId}`),
};

// ─── Exports (mock or real) ───────────────────────────────────────────────────
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
