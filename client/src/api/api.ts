import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  ActivityResponse, ActivityRequest, AuthResponse,
  UserResponse, RecommendationResponse,
} from './types';
import * as mockApi from '../mock/mockApi';

// Controlled via .env:
//   VITE_MOCK_MODE=true  → use local dummy data (no backend needed)
//   VITE_MOCK_MODE=false → call real backend
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (userId) config.headers['X-User-ID'] = userId;
  return config;
});

// ─── Real API functions ───────────────────────────────────────────────────────

const realApi = {
  login: (email: string, password: string): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', { email, password }),

  register: (firstName: string, lastName: string, email: string, password: string): Promise<AxiosResponse<UserResponse>> =>
    api.post('/auth/register', { firstName, lastName, email, password }),

  logout: (): Promise<AxiosResponse<void>> =>
    api.post('/auth/logout'),

  getUserProfile: (userId: string): Promise<AxiosResponse<UserResponse>> =>
    api.get(`/users/${userId}`),

  getActivities: (): Promise<AxiosResponse<ActivityResponse[]>> =>
    api.get('/activities'),

  addActivity: (activity: ActivityRequest): Promise<AxiosResponse<ActivityResponse>> =>
    api.post('/activities', activity),

  getActivity: (activityId: string): Promise<AxiosResponse<ActivityResponse>> =>
    api.get(`/activities/${activityId}`),

  getActivityRecommendation: (activityId: string): Promise<AxiosResponse<RecommendationResponse>> =>
    api.get(`/recommendations/activity/${activityId}`),

  getUserRecommendations: (userId: string): Promise<AxiosResponse<RecommendationResponse[]>> =>
    api.get(`/recommendations/user/${userId}`),
};

// ─── Exports (mock or real) ───────────────────────────────────────────────────

const {
  login, register, getUserProfile,
  getActivities, addActivity, getActivity,
  getActivityRecommendation, getUserRecommendations,
} = (MOCK_MODE ? mockApi : realApi) as typeof realApi;

// logout is always real (no mock needed)
const logout = realApi.logout;

export {
  login, register, logout, getUserProfile,
  getActivities, addActivity, getActivity,
  getActivityRecommendation, getUserRecommendations,
};

export default api;
