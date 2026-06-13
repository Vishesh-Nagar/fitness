import { useState, useEffect, useCallback } from 'react';
import { getActivities } from '../api/api';
import ActivityCard from '../components/activity/ActivityCard';
import ActivityForm from '../components/activity/ActivityForm';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Timer, Flame, BarChart2, X } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit }) => (
  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-[var(--color-text-faint)]" />
      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium">{label}</span>
    </div>
    <p className="text-2xl font-semibold text-[var(--color-text)] tracking-tight">
      {value}
      {unit && <span className="text-sm font-normal text-[var(--color-text-muted)] ml-1">{unit}</span>}
    </p>
  </div>
);

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

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

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const totalDuration = activities.reduce((s, a) => s + (a.duration || 0), 0);
  const totalCalories = activities.reduce((s, a) => s + (a.caloriesBurned || 0), 0);

  const handleActivityAdded = () => {
    setShowForm(false);
    fetchActivities();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">Dashboard</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Your workout history</p>
          </div>
          <Button
            variant={showForm ? 'ghost' : 'primary'}
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5"
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Cancel' : 'Log Activity'}
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={BarChart2} label="Total" value={activities.length} unit="sessions" />
          <StatCard icon={Timer} label="Duration" value={totalDuration} unit="min" />
          <StatCard icon={Flame} label="Calories" value={totalCalories} unit="kcal" />
        </div>

        {/* Log form Modal */}
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <ActivityForm onActivityAdded={handleActivityAdded} onClose={() => setShowForm(false)} />
        </Modal>

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
    </div>
  );
};

export default DashboardPage;
