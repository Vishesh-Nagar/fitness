/**
 * mockApi.ts — Simulates all backend API calls with realistic delays.
 * Adapted from web: uses in-memory array instead of sessionStorage.
 */

import { MOCK_USERS, MOCK_ACTIVITIES, MOCK_RECOMMENDATIONS } from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms = 200 + Math.random() * 150) =>
  new Promise((res) => setTimeout(res, ms));

const ok = (data: unknown) => ({ data });

const fail = (status: number, message: string) => {
  const err: any = new Error(message);
  err.response = { status, data: { message } };
  return Promise.reject(err);
};

// ─── In-memory "database" ─────────────────────────────────────────────────────
let activities = [...MOCK_ACTIVITIES];

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const login = async (email: string, password: string) => {
  await delay();
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user || (password !== user.password && password !== 'password123')) {
    if (password.length >= 6) {
      const guest = MOCK_USERS[0];
      return ok({ token: guest.token, userId: guest.id, email });
    }
    return fail(401, 'Invalid email or password.');
  }
  return ok({ token: user.token, userId: user.id, email: user.email });
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  await delay();
  const existing = MOCK_USERS.find((u) => u.email === email);
  if (existing) return fail(409, 'An account with this email already exists.');
  MOCK_USERS.push({
    id: `user-${Date.now()}`,
    firstName,
    lastName,
    email,
    password,
    token: `mock-jwt-token-${Date.now()}`,
  });
  return ok({ message: 'Registration successful.' });
};

// ─── Activities ───────────────────────────────────────────────────────────────
export const getActivities = async () => {
  await delay();
  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return ok(sorted);
};

export const addActivity = async (activity: any) => {
  await delay();
  const newActivity = {
    id: `act-${Date.now()}`,
    userId: 'user-001',
    type: activity.type,
    duration: activity.duration ?? null,
    caloriesBurned: activity.caloriesBurned ?? null,
    startTime: activity.startTime || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    additionalMetrics: activity.additionalMetrics || {},
  };
  activities.unshift(newActivity);
  return ok(newActivity);
};

export const getActivity = async (id: string) => {
  await delay();
  const activity = activities.find((a) => a.id === id);
  if (!activity) return fail(404, 'Activity not found.');
  return ok(activity);
};

// ─── User ─────────────────────────────────────────────────────────────────────
export const getUserProfile = async (userId: string) => {
  await delay();
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return fail(404, 'User not found.');
  const { password: _p, token: _t, ...safeUser } = user;
  return ok(safeUser);
};

// ─── Recommendations ─────────────────────────────────────────────────────────
export const getActivityRecommendation = async (activityId: string) => {
  await delay();
  const rec = MOCK_RECOMMENDATIONS.find((r) => r.activityId === activityId);
  if (rec) return ok(rec);
  return ok({
    id: `rec-new-${activityId}`,
    activityId,
    userId: 'user-001',
    activityType: 'OTHER',
    recommendation:
      'Overall: Great effort logging this activity! AI analysis is generated asynchronously — check back shortly for your personalised insights.\n\nThis recommendation will be populated once the AI service processes your activity data.',
    improvements: [
      'Consistency: Logging activities regularly gives the AI more data to personalise your recommendations.',
      'Detail: Add metrics like heart rate and distance to get more specific analysis.',
      'Variety: Mix different activity types to get cross-sport recommendations.',
    ],
    suggestions: [
      'Keep It Up: Continue your current routine and your recommendations will become more tailored over time.',
      'Explore: Try a new activity type to discover what the AI recommends.',
    ],
    safety: [
      'Always warm up before any physical activity.',
      'Stay hydrated throughout your workout.',
      'Listen to your body and rest when needed.',
    ],
    createdAt: new Date().toISOString(),
  });
};

export const getUserRecommendations = async (userId: string) => {
  await delay();
  return ok(MOCK_RECOMMENDATIONS.filter((r) => r.userId === userId));
};
