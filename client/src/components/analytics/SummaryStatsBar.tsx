import { useEffect, useState } from 'react';
import analyticsApi from '../../api/analyticsApi';
import type { SummaryDto } from '../../api/types';
import { BarChart2, Flame, Timer } from 'lucide-react';

interface Props {
  userId: string;
}

interface StatTileProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit: string;
}

function StatTile({ icon: Icon, label, value, unit }: StatTileProps) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-[var(--color-text-faint)]" />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold text-[var(--color-text)] tracking-tight">
        {value}
        <span className="text-sm font-normal text-[var(--color-text-muted)] ml-1">{unit}</span>
      </p>
    </div>
  );
}

export default function SummaryStatsBar({ userId }: Props) {
  const [summary, setSummary] = useState<SummaryDto | null>(null);

  useEffect(() => {
    if (!userId) return;
    analyticsApi.getSummary(userId)
      .then(r => setSummary(r.data))
      .catch(() => setSummary(null));
  }, [userId]);

  return (
    <>
      <StatTile
        icon={BarChart2}
        label="Total"
        value={summary?.totalSessions ?? 0}
        unit="sessions"
      />
      <StatTile
        icon={Timer}
        label="Avg Duration"
        value={summary?.avgDurationMinutes ?? 0}
        unit="min"
      />
      <StatTile
        icon={Flame}
        label="Calories"
        value={summary?.totalCalories ?? 0}
        unit="kcal"
      />
    </>
  );
}
