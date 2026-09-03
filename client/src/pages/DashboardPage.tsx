import { useState, useEffect, useCallback, useRef } from 'react';
import { getActivities } from '../api/api';
import type { ActivityResponse } from '../api/types';
import ActivityCard from '../components/activity/ActivityCard';
import ActivityForm from '../components/activity/ActivityForm';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StreakCard from '../components/analytics/StreakCard';
import SummaryStatsBar from '../components/analytics/SummaryStatsBar';
import WeeklyVolumeChart from '../components/analytics/WeeklyVolumeChart';
import ActivityTypeBreakdown from '../components/analytics/ActivityTypeBreakdown';
import { useRecommendationNotifications } from '../hooks/useRecommendationNotifications';
import { Plus, X, Bell } from 'lucide-react';

// ─── Simple in-page toast (no extra library needed) ──────────────────────────

interface Toast {
  id: number;
  message: string;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-4 py-3 shadow-lg text-sm text-[var(--color-text)] animate-[fadeInUp_0.2s_ease]"
        >
          <Bell size={14} className="text-indigo-400 shrink-0" />
          {t.message}
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-auto text-[var(--color-text-faint)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const DashboardPage = () => {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  // Get userId from localStorage (set by AuthContext on login)
  const userId = localStorage.getItem('userId') ?? '';

  const fetchActivities = useCallback(async () => {
    try {
      setError('');
      const { data } = await getActivities();
      setActivities(data);
    } catch {
      setError('Could not load activities. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  // WebSocket notifications for AI recommendations
  const handleNotification = useCallback((payload: { activityId: string; message: string }) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message: payload.message }]);
    // Auto-dismiss after 6 s
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  }, []);

  useRecommendationNotifications(userId || null, handleNotification);

  const handleActivityAdded = () => {
    setShowForm(false);
    fetchActivities();
  };

  const dismissToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">Dashboard</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your workout history &amp; analytics</p>
          </div>
          <Button
            variant={showForm ? 'ghost' : 'primary'}
            size="sm"
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1.5"
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Cancel' : 'Log Activity'}
          </Button>
        </div>

        {/* Analytics row 1: Summary KPIs + Streak */}
        {userId && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <SummaryStatsBar userId={userId} />
              <StreakCard userId={userId} />
            </div>

            {/* Analytics row 2: Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <WeeklyVolumeChart userId={userId} />
              <ActivityTypeBreakdown userId={userId} />
            </div>
          </>
        )}

        {/* Log form Modal */}
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <ActivityForm onActivityAdded={handleActivityAdded} onClose={() => setShowForm(false)} />
        </Modal>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium whitespace-nowrap">
            Recent Activities
          </p>
          <div className="flex-1 border-t border-[var(--color-border)]" />
        </div>

        {/* Activity grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-[var(--color-border)] border-t-[var(--color-text-muted)] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-sm text-[var(--color-text-muted)]">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-4">No activities logged yet.</p>
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus size={14} />
              Log your first workout
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity, i) => (
              <div key={activity.id} style={{ animationDelay: `${i * 40}ms` }}>
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        )}
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default DashboardPage;
