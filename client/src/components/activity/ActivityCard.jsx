import { useNavigate } from 'react-router';
import { Timer, Flame, ChevronRight } from 'lucide-react';

const ACTIVITY_LABELS = {
  RUNNING: 'Running',
  WALKING: 'Walking',
  CYCLING: 'Cycling',
  SWIMMING: 'Swimming',
  WEIGHT_TRAINING: 'Weights',
  YOGA: 'Yoga',
  HIIT: 'HIIT',
  CARDIO: 'Cardio',
  STRETCHING: 'Stretching',
  OTHER: 'Other',
};

const ACTIVITY_COLORS = {
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
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ActivityCard = ({ activity }) => {
  const navigate = useNavigate();
  const label = ACTIVITY_LABELS[activity.type] || activity.type;
  const accentColor = ACTIVITY_COLORS[activity.type] || '#94a3b8';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/activities/${activity.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/activities/${activity.id}`)}
      className="
        group relative bg-[var(--color-surface)] border border-[var(--color-border)]
        rounded-[var(--radius-lg)] p-5 cursor-pointer
        hover:border-[var(--color-text-faint)] transition-all duration-200
        animate-fade-in
      "
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="text-xs font-semibold px-2 py-1 rounded-[var(--radius-sm)]"
          style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
        >
          {label}
        </div>
        <ChevronRight
          size={14}
          className="text-[var(--color-text-faint)] group-hover:text-[var(--color-text-muted)] transition-colors mt-0.5"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <Timer size={13} className="text-[var(--color-text-faint)]" />
          <span className="text-sm font-medium text-[var(--color-text)]">
            {activity.duration ?? '—'}
            <span className="text-xs text-[var(--color-text-muted)] font-normal ml-0.5">min</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame size={13} className="text-[var(--color-text-faint)]" />
          <span className="text-sm font-medium text-[var(--color-text)]">
            {activity.caloriesBurned ?? '—'}
            <span className="text-xs text-[var(--color-text-muted)] font-normal ml-0.5">kcal</span>
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
        <span className="text-xs text-[var(--color-text-faint)]">
          {formatDate(activity.startTime || activity.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ActivityCard;
