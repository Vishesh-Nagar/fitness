// ─── Core domain types ────────────────────────────────────────────────────────

export type ActivityType =
  | 'RUNNING' | 'CYCLING' | 'SWIMMING' | 'WALKING'
  | 'HIKING' | 'YOGA' | 'STRENGTH_TRAINING' | 'OTHER';

export interface ActivityResponse {
  id: string;
  userId: string;
  type: ActivityType;
  duration: number;           // minutes
  caloriesBurned: number;
  startTime: string;          // ISO datetime string
  createdAt: string;
  updatedAt: string;
  additionalMetrics?: Record<string, unknown>;
}

export interface ActivityRequest {
  type: ActivityType;
  duration: number;
  caloriesBurned: number;
  startTime: string;
  additionalMetrics?: Record<string, unknown>;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface RecommendationResponse {
  id: string;
  activityId: string;
  userId: string;
  activityType: string;
  recommendation: string;
  improvements: string[];
  suggestions: string[];
  safety: string[];
  generatedAt: string;
}

// ─── Analytics types ─────────────────────────────────────────────────────────

export interface StreakDto {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface WeeklyVolumeDto {
  date: string;           // yyyy-MM-dd
  totalMinutes: number;
  totalCalories: number;
  sessionCount: number;
}

export interface SummaryDto {
  totalSessions: number;
  totalCalories: number;
  avgDurationMinutes: number;
}

export interface TypeBreakdownDto {
  type: string;
  count: number;
  percentage: number;
}

// ─── Error shape ─────────────────────────────────────────────────────────────

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  fieldErrors?: Record<string, string>;
}
