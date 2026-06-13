import { useState } from 'react';
import { addActivity } from '../../api/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { X } from 'lucide-react';

const ACTIVITY_TYPES = [
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

const INITIAL = {
  type: 'RUNNING',
  duration: '',
  caloriesBurned: '',
  startTime: '',
};

const ActivityForm = ({ onActivityAdded, onClose }) => {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        type: form.type,
        duration: form.duration ? parseInt(form.duration, 10) : null,
        caloriesBurned: form.caloriesBurned ? parseInt(form.caloriesBurned, 10) : null,
        startTime: form.startTime || null,
      };
      await addActivity(payload);
      setForm(INITIAL);
      onActivityAdded?.();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to log activity. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 animate-slide-down">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Log Activity</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          id="activity-type"
          label="Activity Type"
          value={form.type}
          onChange={set('type')}
        >
          {ACTIVITY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="activity-duration"
            label="Duration"
            type="number"
            min="1"
            placeholder="minutes"
            value={form.duration}
            onChange={set('duration')}
          />
          <Input
            id="activity-calories"
            label="Calories"
            type="number"
            min="0"
            placeholder="kcal"
            value={form.caloriesBurned}
            onChange={set('caloriesBurned')}
          />
        </div>

        <Input
          id="activity-start"
          label="Start Time"
          type="datetime-local"
          value={form.startTime}
          onChange={set('startTime')}
        />

        {error && (
          <p className="text-xs text-[var(--color-error)]">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full mt-1">
          Log Activity
        </Button>
      </form>
    </div>
  );
};

export default ActivityForm;
