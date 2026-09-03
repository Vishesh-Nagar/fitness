import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import analyticsApi from '../../api/analyticsApi';
import type { WeeklyVolumeDto } from '../../api/types';

interface Props {
  userId: string;
}

export default function WeeklyVolumeChart({ userId }: Props) {
  const [data, setData] = useState<WeeklyVolumeDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const to = format(new Date(), 'yyyy-MM-dd');
    const from = format(subDays(new Date(), 13), 'yyyy-MM-dd'); // last 14 days
    analyticsApi.getWeeklyVolume(userId, from, to)
      .then(r => setData(r.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const formatted = data.map(d => ({
    ...d,
    day: format(new Date(d.date), 'EEE dd'),
  }));

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 h-56 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[var(--color-border)] border-t-[var(--color-text-muted)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium mb-4">
        14-Day Volume
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={formatted} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="colMinutes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colCalories" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }}
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="totalMinutes"
            name="Minutes"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#colMinutes)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="totalCalories"
            name="Calories"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#colCalories)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
