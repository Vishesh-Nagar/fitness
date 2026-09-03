import { useEffect, useState } from 'react';
import analyticsApi from '../../api/analyticsApi';
import type { StreakDto } from '../../api/types';
import { Flame } from 'lucide-react';

interface Props {
  userId: string;
}

export default function StreakCard({ userId }: Props) {
  const [streak, setStreak] = useState<StreakDto | null>(null);

  useEffect(() => {
    if (!userId) return;
    analyticsApi.getStreaks(userId)
      .then(r => setStreak(r.data))
      .catch(() => setStreak(null));
  }, [userId]);

  const current = streak?.currentStreak ?? 0;
  const longest = streak?.longestStreak ?? 0;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Flame
          size={16}
          className={current > 0 ? 'text-orange-400' : 'text-[var(--color-text-faint)]'}
        />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-medium">
          Streak
        </span>
      </div>

      <div className="flex items-end gap-4">
        <div>
          <p className="text-3xl font-semibold text-[var(--color-text)] leading-none">
            {current}
            <span className="text-sm font-normal text-[var(--color-text-muted)] ml-1">days</span>
          </p>
          <p className="text-xs text-[var(--color-text-faint)] mt-1">current</p>
        </div>
        <div className="border-l border-[var(--color-border)] pl-4">
          <p className="text-xl font-semibold text-[var(--color-text)] leading-none">
            {longest}
            <span className="text-sm font-normal text-[var(--color-text-muted)] ml-1">days</span>
          </p>
          <p className="text-xs text-[var(--color-text-faint)] mt-1">best</p>
        </div>
      </div>

      {streak?.lastActivityDate && (
        <p className="text-xs text-[var(--color-text-faint)]">
          Last activity: {streak.lastActivityDate}
        </p>
      )}
    </div>
  );
}
