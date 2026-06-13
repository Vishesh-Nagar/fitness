/**
 * mockApi.js — Simulates all backend API calls with realistic delays and dummy data.
 * Swap imports in api/api.js to use the real Axios instance when backend is ready.
 */

import { MOCK_USERS, MOCK_ACTIVITIES, MOCK_RECOMMENDATIONS } from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simulates a network round-trip (150–350 ms) */
const delay = (ms = 200 + Math.random() * 150) =>
  new Promise((res) => setTimeout(res, ms));

/** Returns a resolved Promise shaped like an Axios response */
const ok = (data) => ({ data });

/** Returns a rejected Promise shaped like an Axios error */
const fail = (status, message) => {
  const err = new Error(message);
  err.response = { status, data: { message } };
  return Promise.reject(err);
};

// ─── In-memory "database" (persisted to sessionStorage so page refreshes work) ─

const DB_KEY = 'fitness_mock_activities';

const loadActivities = () => {
  try {
    const raw = sessionStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : [...MOCK_ACTIVITIES];
  } catch {
    return [...MOCK_ACTIVITIES];
  }
};

const saveActivities = (activities) => {
  sessionStorage.setItem(DB_KEY, JSON.stringify(activities));
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Accepts any email matching a mock user + their password (or 'password123' shortcut).
 * Also accepts any email/password combination for easy demo — just uses the first mock user.
 */
export const login = async (email, password) => {
  await delay();

  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user || (password !== user.password && password !== 'password123')) {
    // Allow any credentials for demo convenience
    if (password.length >= 6) {
      // Use first user as a "guest" login for demo purposes
      const guest = MOCK_USERS[0];
      return ok({ token: guest.token, userId: guest.id, email: email });
    }
    return fail(401, 'Invalid email or password.');
  }

  return ok({ token: user.token, userId: user.id, email: user.email });
};

/**
 * POST /auth/register
 */
export const register = async (firstName, lastName, email, password) => {
  await delay();

  const existing = MOCK_USERS.find((u) => u.email === email);
  if (existing) {
    return fail(409, 'An account with this email already exists.');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    firstName,
    lastName,
    email,
    token: `mock-jwt-token-${Date.now()}`,
  };

  // Push into in-memory array so subsequent logins within session work
  MOCK_USERS.push({ ...newUser, password });

  return ok({ message: 'Registration successful. Please sign in.' });
};

// ─── Activities ───────────────────────────────────────────────────────────────

/**
 * GET /activities
 * Returns all activities for the current session (newest first).
 */
export const getActivities = async () => {
  await delay();
  const activities = loadActivities();
  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return ok(sorted);
};

/**
 * POST /activities
 * Adds a new activity and persists it for the session.
 */
export const addActivity = async (activity) => {
  await delay();

  const newActivity = {
    id: `act-${Date.now()}`,
    userId: localStorage.getItem('userId') || 'user-001',
    type: activity.type,
    duration: activity.duration ?? null,
    caloriesBurned: activity.caloriesBurned ?? null,
    startTime: activity.startTime || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    additionalMetrics: activity.additionalMetrics || {},
  };

  const activities = loadActivities();
  activities.unshift(newActivity);
  saveActivities(activities);

  return ok(newActivity);
};

/**
 * GET /activities/:id
 * Returns a single activity by ID.
 */
export const getActivity = async (id) => {
  await delay();
  const activities = loadActivities();
  const activity = activities.find((a) => a.id === id);
  if (!activity) return fail(404, 'Activity not found.');
  return ok(activity);
};

// ─── User ─────────────────────────────────────────────────────────────────────

/**
 * GET /users/:userId
 */
export const getUserProfile = async (userId) => {
  await delay();
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return fail(404, 'User not found.');
  const { password: _, token: __, ...safeUser } = user;
  return ok(safeUser);
};

// ─── Recommendations ─────────────────────────────────────────────────────────

/**
 * GET /recommendations/activity/:activityId
 * Returns the AI recommendation for a specific activity.
 * For user-added activities (no pre-seeded rec), returns a generic one.
 */
export const getActivityRecommendation = async (activityId) => {
  await delay();
  const rec = MOCK_RECOMMENDATIONS.find((r) => r.activityId === activityId);
  if (rec) return ok(rec);

  // Graceful fallback for activities added during the session
  return ok({
    id: `rec-new-${activityId}`,
    activityId,
    userId: localStorage.getItem('userId') || 'user-001',
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
      'Explore: Try a new activity type to discover what the AI recommends for different disciplines.',
    ],
    safety: [
      'Always warm up before any physical activity.',
      'Stay hydrated throughout your workout.',
      'Listen to your body and rest when needed.',
    ],
    createdAt: new Date().toISOString(),
  });
};

/**
 * GET /recommendations/user/:userId
 * Returns all AI recommendations for a user.
 */
export const getUserRecommendations = async (userId) => {
  await delay();
  const recs = MOCK_RECOMMENDATIONS.filter((r) => r.userId === userId);
  return ok(recs);
};
