import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Timer, Flame, ChevronRight } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { ACTIVITY_LABELS } from '@/constants/theme';

interface Activity {
  id: string;
  type: string;
  duration?: number | null;
  caloriesBurned?: number | null;
  startTime?: string;
  createdAt?: string;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  const router = useRouter();
  const label = ACTIVITY_LABELS[activity.type] || activity.type;
  const accentColor = (Colors as any)[activity.type] || Colors.OTHER;
  const accentBg = `${accentColor}18`;

  return (
    <Pressable
      onPress={() => router.push(`/activity/${activity.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: accentBg }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>{label}</Text>
        </View>
        <ChevronRight size={14} color={Colors.textFaint} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Timer size={13} color={Colors.textFaint} />
          <Text style={styles.statValue}>
            {activity.duration ?? '—'}
            <Text style={styles.statUnit}> min</Text>
          </Text>
        </View>
        <View style={styles.stat}>
          <Flame size={13} color={Colors.textFaint} />
          <Text style={styles.statValue}>
            {activity.caloriesBurned ?? '—'}
            <Text style={styles.statUnit}> kcal</Text>
          </Text>
        </View>
      </View>

      {/* Date */}
      <View style={styles.dateRow}>
        <Text style={styles.date}>
          {formatDate(activity.startTime || activity.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    marginBottom: Spacing[3],
  },
  pressed: {
    opacity: 0.8,
    borderColor: Colors.textFaint,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[4],
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing[5],
    marginBottom: Spacing[3],
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  statUnit: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
  },
  dateRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Spacing[3],
    marginTop: Spacing[1],
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textFaint,
  },
});

export default ActivityCard;
