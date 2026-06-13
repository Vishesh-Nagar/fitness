import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Timer,
  Flame,
  Calendar,
  Activity,
  TrendingUp,
  Lightbulb,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import { getActivity, getActivityRecommendation } from '@/api/api';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { ACTIVITY_LABELS } from '@/constants/theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDateTime = (dt?: string) => {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const MetaRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
}) => (
  <View style={metaStyles.row}>
    <View style={metaStyles.labelGroup}>
      <Icon size={13} color={Colors.textFaint} />
      <Text style={metaStyles.label}>{label}</Text>
    </View>
    <Text style={metaStyles.value}>{value}</Text>
  </View>
);

const metaStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 110,
  },
  label: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
});

const AiSection = ({
  icon: Icon,
  label,
  color,
  items,
}: {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  items: string[];
}) => (
  <View style={aiStyles.section}>
    <View style={aiStyles.sectionHeader}>
      <Icon size={13} color={color} />
      <Text style={[aiStyles.sectionLabel, { color }]}>{label}</Text>
    </View>
    {items.map((item, i) => {
      const colonIdx = item.indexOf(':');
      const hasLabel = colonIdx > 0 && colonIdx < 30;
      const title = hasLabel ? item.slice(0, colonIdx) : null;
      const body = hasLabel ? item.slice(colonIdx + 1).trim() : item;
      return (
        <View key={i} style={aiStyles.bulletRow}>
          <View style={[aiStyles.dot, { backgroundColor: color }]} />
          <Text style={aiStyles.bulletText}>
            {title && <Text style={aiStyles.bulletTitle}>{title}: </Text>}
            {body}
          </Text>
        </View>
      );
    })}
  </View>
);

const aiStyles = StyleSheet.create({
  section: {
    marginBottom: Spacing[5],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing[3],
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 7,
    opacity: 0.75,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  bulletTitle: {
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [activity, setActivity] = useState<any>(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');

  const [rec, setRec] = useState<any>(null);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

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

  const accentColor = activity ? (Colors as any)[activity.type] || Colors.OTHER : Colors.OTHER;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Fixed Back Button */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <ArrowLeft size={18} color={Colors.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      {activityLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.textMuted} />
        </View>
      ) : activityError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{activityError}</Text>
        </View>
      ) : activity ? (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Type badge */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: `${accentColor}18` }]}>
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {ACTIVITY_LABELS[activity.type] || activity.type}
              </Text>
            </View>
          </View>

          {/* Details card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Details</Text>
            <MetaRow icon={Timer} label="Duration" value={activity.duration ? `${activity.duration} min` : '—'} />
            <MetaRow icon={Flame} label="Calories" value={activity.caloriesBurned ? `${activity.caloriesBurned} kcal` : '—'} />
            <MetaRow icon={Calendar} label="Started" value={formatDateTime(activity.startTime)} />
            <View style={[metaStyles.row, { borderBottomWidth: 0 }]}>
              <View style={metaStyles.labelGroup}>
                <Activity size={13} color={Colors.textFaint} />
                <Text style={metaStyles.label}>Logged at</Text>
              </View>
              <Text style={[metaStyles.value]}>{formatDateTime(activity.createdAt)}</Text>
            </View>
          </View>

          {/* Additional metrics */}
          {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Additional Metrics</Text>
              {Object.entries(activity.additionalMetrics).map(([key, val], i, arr) => (
                <View
                  key={key}
                  style={[
                    styles.metricsRow,
                    i === arr.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text style={styles.metricKey}>{key.replace(/_/g, ' ')}</Text>
                  <Text style={styles.metricVal}>{String(val)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* AI Recommendation */}
          {recLoading ? (
            <View style={styles.aiLoadingCard}>
              <View style={styles.aiHeader}>
                <Sparkles size={14} color={Colors.accent} />
                <Text style={styles.aiTitle}>AI Analysis</Text>
              </View>
              <View style={styles.aiLoadingRow}>
                <ActivityIndicator size="small" color={Colors.accent} />
                <Text style={styles.aiLoadingText}>Generating your personalised analysis…</Text>
              </View>
            </View>
          ) : rec ? (
            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Sparkles size={14} color={Colors.accent} />
                <Text style={styles.aiTitle}>AI Analysis</Text>
              </View>

              {/* Recommendation paragraphs */}
              <View style={styles.recParagraphs}>
                {rec.recommendation
                  .split(/\n\n+/)
                  .map((p: string) => p.trim())
                  .filter(Boolean)
                  .map((para: string, i: number) => {
                    const colonIdx = para.indexOf(':');
                    const hasLabel = colonIdx > 0 && colonIdx < 20;
                    const label = hasLabel ? para.slice(0, colonIdx) : null;
                    const text = hasLabel ? para.slice(colonIdx + 1).trim() : para;
                    return (
                      <Text key={i} style={styles.paraTxt}>
                        {label && (
                          <Text style={styles.paraLabel}>{label}: </Text>
                        )}
                        {text}
                      </Text>
                    );
                  })}
              </View>

              {/* Sections */}
              {rec.improvements?.length > 0 && (
                <>
                  <View style={styles.aiDivider} />
                  <AiSection icon={TrendingUp} label="Improvements" color="#e8ff48" items={rec.improvements} />
                </>
              )}
              {rec.suggestions?.length > 0 && (
                <>
                  <View style={styles.aiDivider} />
                  <AiSection icon={Lightbulb} label="Next Workouts" color="#7dd3fc" items={rec.suggestions} />
                </>
              )}
              {rec.safety?.length > 0 && (
                <>
                  <View style={styles.aiDivider} />
                  <AiSection icon={ShieldCheck} label="Safety" color="#86efac" items={rec.safety} />
                </>
              )}

              <View style={styles.aiDivider} />
              <Text style={styles.aiGenerated}>Generated {formatDateTime(rec.createdAt)}</Text>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  navBar: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingBottom: 60,
    paddingTop: Spacing[4],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  badgeRow: {
    marginBottom: Spacing[5],
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    marginBottom: Spacing[4],
  },
  cardLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing[3],
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  metricKey: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  metricVal: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  aiLoadingCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    marginBottom: Spacing[4],
  },
  aiCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    marginBottom: Spacing[4],
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing[4],
  },
  aiTitle: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  aiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiLoadingText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  recParagraphs: {
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  paraTxt: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  paraLabel: {
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  aiDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing[4],
  },
  aiGenerated: {
    fontSize: FontSize.xs,
    color: Colors.textFaint,
  },
});
