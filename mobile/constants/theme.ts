// ─── Color Palette ────────────────────────────────────────────────────────────
export const Colors = {
  // Background layers
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceAlt: '#161616',
  border: '#222222',
  borderSubtle: '#1a1a1a',

  // Text hierarchy
  text: '#f0f0f0',
  textMuted: '#888888',
  textFaint: '#444444',

  // Accent
  accent: '#e8ff48',
  accentBg: '#e8ff4812',
  error: '#ef4444',
  errorBg: '#ef444410',
  errorBorder: '#ef444430',

  // Activity type colors
  RUNNING: '#e8ff48',
  WALKING: '#88cc88',
  CYCLING: '#7dd3fc',
  SWIMMING: '#67e8f9',
  WEIGHT_TRAINING: '#f97316',
  YOGA: '#c084fc',
  HIIT: '#fb7185',
  CARDIO: '#fbbf24',
  STRETCHING: '#86efac',
  OTHER: '#94a3b8',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

// ─── Activity Metadata ────────────────────────────────────────────────────────
export const ACTIVITY_LABELS: Record<string, string> = {
  RUNNING: 'Running',
  WALKING: 'Walking',
  CYCLING: 'Cycling',
  SWIMMING: 'Swimming',
  WEIGHT_TRAINING: 'Weight Training',
  YOGA: 'Yoga',
  HIIT: 'HIIT',
  CARDIO: 'Cardio',
  STRETCHING: 'Stretching',
  OTHER: 'Other',
};

export const ACTIVITY_TYPES = [
  { value: 'RUNNING', label: 'Running' },
  { value: 'WALKING', label: 'Walking' },
  { value: 'CYCLING', label: 'Cycling' },
  { value: 'SWIMMING', label: 'Swimming' },
  { value: 'WEIGHT_TRAINING', label: 'Weight Training' },
  { value: 'YOGA', label: 'Yoga' },
  { value: 'HIIT', label: 'HIIT' },
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'STRETCHING', label: 'Stretching' },
  { value: 'OTHER', label: 'Other' },
];
