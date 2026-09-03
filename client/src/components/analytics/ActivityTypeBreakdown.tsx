import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import analyticsApi from '../../api/analyticsApi';
import type { TypeBreakdownDto } from '../../api/types';

interface Props {
  userId: string;
}

const COLORS = ['#6366f1', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function ActivityTypeBreakdown({ userId }: Props) {
  const [data, setData] = useState<TypeBreakdownDto[]>([]);

  useEffect(() => {
    if (!userId) return;
    analyticsApi.getTypeBreakdown(userId)
      .then(r => setData(r.data))
      .catch(() => setData([]));
  }, [userId]);

  if (data.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 flex items-center justify-center h-56">
        <p className="text-sm text-[var(--color-text-muted)]">No activity data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium mb-4">
        Activity Types
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="count"
            nameKey="type"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => [
              `${value} sessions`,
              name.replace('_', ' '),
            ]}
          />
          <Legend
            formatter={(value: string) => value.replace('_', ' ')}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
