import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivity, getActivityRecommendation } from '../api/api';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import {
  ArrowLeft, Timer, Flame, Calendar, Activity,
  TrendingUp, Lightbulb, ShieldCheck, Sparkles,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVITY_LABELS = {
  RUNNING: 'Running', WALKING: 'Walking', CYCLING: 'Cycling',
  SWIMMING: 'Swimming', WEIGHT_TRAINING: 'Weight Training', YOGA: 'Yoga',
  HIIT: 'HIIT', CARDIO: 'Cardio', STRETCHING: 'Stretching', OTHER: 'Other',
};

const ACTIVITY_COLORS = {
  RUNNING: '#e8ff48', WALKING: '#88cc88', CYCLING: '#7dd3fc',
  SWIMMING: '#67e8f9', WEIGHT_TRAINING: '#f97316', YOGA: '#c084fc',
  HIIT: '#fb7185', CARDIO: '#fbbf24', STRETCHING: '#86efac', OTHER: '#94a3b8',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateTime = (dt) => {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const MetaRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-3 border-b border-[var(--color-border-subtle)] last:border-0">
    <div className="flex items-center gap-2 w-32 flex-shrink-0">
      <Icon size={13} className="text-[var(--color-text-faint)]" />
      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-sm text-[var(--color-text)]">{value}</span>
  </div>
);

const AiSection = ({ icon: Icon, label, color, items }) => (
  <div className="mb-5 last:mb-0">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} style={{ color }} />
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>
        {label}
      </span>
    </div>
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => {
        const colonIdx = item.indexOf(':');
        const hasLabel = colonIdx > 0 && colonIdx < 30;
        const title = hasLabel ? item.slice(0, colonIdx) : null;
        const body = hasLabel ? item.slice(colonIdx + 1).trim() : item;
        return (
          <li key={i} className="flex gap-2.5">
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color, opacity: 0.7 }}
            />
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {title && (
                <span className="text-[var(--color-text)] font-medium">{title}: </span>
              )}
              {body}
            </p>
          </li>
        );
      })}
    </ul>
  </div>
);

const AiAnalysisCard = ({ rec }) => {
  // Parse the recommendation text into labelled paragraphs
  const paragraphs = rec.recommendation
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 mb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={14} className="text-[var(--color-accent)]" />
        <h2 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest">
          AI Analysis
        </h2>
      </div>

      {/* Analysis paragraphs */}
      <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-[var(--color-border-subtle)]">
        {paragraphs.map((para, i) => {
          const colonIdx = para.indexOf(':');
          const hasLabel = colonIdx > 0 && colonIdx < 20;
          const label = hasLabel ? para.slice(0, colonIdx) : null;
          const text = hasLabel ? para.slice(colonIdx + 1).trim() : para;
          return (
            <p key={i} className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {label && (
                <span className="text-[var(--color-text)] font-semibold">{label}: </span>
              )}
              {text}
            </p>
          );
        })}
      </div>

      {/* Improvements */}
      {rec.improvements?.length > 0 && (
        <AiSection
          icon={TrendingUp}
          label="Improvements"
          color="#e8ff48"
          items={rec.improvements}
        />
      )}

      {/* Suggestions */}
      {rec.suggestions?.length > 0 && (
        <div className="border-t border-[var(--color-border-subtle)] pt-5 mt-5">
          <AiSection
            icon={Lightbulb}
            label="Next Workouts"
            color="#7dd3fc"
            items={rec.suggestions}
          />
        </div>
      )}

      {/* Safety */}
      {rec.safety?.length > 0 && (
        <div className="border-t border-[var(--color-border-subtle)] pt-5 mt-5">
          <AiSection
            icon={ShieldCheck}
            label="Safety"
            color="#86efac"
            items={rec.safety}
          />
        </div>
      )}

      <p className="text-xs text-[var(--color-text-faint)] mt-5 pt-4 border-t border-[var(--color-border-subtle)]">
        Generated {formatDateTime(rec.createdAt)}
      </p>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');

  const [rec, setRec] = useState(null);
  const [recLoading, setRecLoading] = useState(true);

  // Fetch activity and recommendation in parallel
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await getActivity(id);
        setActivity(data);
      } catch {
        setActivityError('Activity not found or failed to load.');
      } finally {
        setActivityLoading(false);
      }
    };

    const fetchRec = async () => {
      try {
        const { data } = await getActivityRecommendation(id);
        setRec(data);
      } catch {
        // Silently suppress — recommendation is optional
      } finally {
        setRecLoading(false);
      }
    };

    fetchActivity();
    fetchRec();
  }, [id]);

  const loading = activityLoading;
  const color = ACTIVITY_COLORS[activity?.type] || '#94a3b8';

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Back
        </Button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-[var(--color-border)] border-t-[var(--color-text-muted)] rounded-full animate-spin" />
          </div>
        ) : activityError ? (
          <div className="text-center py-20">
            <p className="text-sm text-[var(--color-text-muted)]">{activityError}</p>
          </div>
        ) : activity ? (
          <div className="animate-fade-in">
            {/* Activity type badge */}
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-[var(--radius-sm)]"
                style={{ color, backgroundColor: `${color}18` }}
              >
                {ACTIVITY_LABELS[activity.type] || activity.type}
              </span>
            </div>

            {/* Details card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 mb-4">
              <h2 className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium mb-4">Details</h2>
              <MetaRow icon={Timer}    label="Duration" value={activity.duration     ? `${activity.duration} min`        : '—'} />
              <MetaRow icon={Flame}    label="Calories" value={activity.caloriesBurned ? `${activity.caloriesBurned} kcal` : '—'} />
              <MetaRow icon={Calendar} label="Started"  value={formatDateTime(activity.startTime)} />
              <MetaRow icon={Activity} label="Logged at" value={formatDateTime(activity.createdAt)} />
            </div>

            {/* Additional metrics */}
            {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 mb-4">
                <h2 className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium mb-4">Additional Metrics</h2>
                <div className="flex flex-col">
                  {Object.entries(activity.additionalMetrics).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2.5 border-b border-[var(--color-border-subtle)] last:border-0"
                    >
                      <span className="text-xs text-[var(--color-text-muted)] capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-sm text-[var(--color-text)]">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI recommendation */}
            {recLoading ? (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-[var(--color-accent)]" />
                  <h2 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest">AI Analysis</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin flex-shrink-0" />
                  <p className="text-sm text-[var(--color-text-muted)]">Generating your personalised analysis…</p>
                </div>
              </div>
            ) : rec ? (
              <AiAnalysisCard rec={rec} />
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ActivityDetailPage;
