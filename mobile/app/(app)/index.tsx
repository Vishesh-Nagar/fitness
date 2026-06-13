import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';
import { Plus, Timer, Flame, BarChart2, Activity } from 'lucide-react-native';
import { getActivities } from '@/api/api';
import { RootState } from '@/store/store';
import ActivityCard from '@/components/activity/ActivityCard';
import LogActivitySheet from '@/components/activity/LogActivitySheet';
import StyledButton from '@/components/ui/StyledButton';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

interface ActivityItem {
  id: string;
  type: string;
  duration?: number | null;
  caloriesBurned?: number | null;
  startTime?: string;
  createdAt?: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  unit: string;
}) => (
  <View style={statStyles.card}>
    <View style={statStyles.labelRow}>
      <Icon size={12} color={Colors.textFaint} />
      <Text style={statStyles.label}>{label}</Text>
    </View>
    <Text style={statStyles.value}>
      {value}
      <Text style={statStyles.unit}> {unit}</Text>
    </Text>
  </View>
);

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing[4],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing[2],
  },
  label: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  unit: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
  },
});

export default function DashboardScreen() {
  const userEmail = useSelector((state: RootState) => state.auth.userEmail);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showLogSheet, setShowLogSheet] = useState(false);

  const fetchActivities = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const { data } = await getActivities();
      setActivities(data);
    } catch {
      setError('Could not load activities.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [fetchActivities])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities(true);
  };

  const totalDuration = activities.reduce((s, a) => s + (a.duration || 0), 0);
  const totalCalories = activities.reduce((s, a) => s + (a.caloriesBurned || 0), 0);

  const greeting = userEmail ? `Hey, ${userEmail.split('@')[0]}` : 'Dashboard';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subtitle}>Your workout history</Text>
          </View>
          <Pressable
            onPress={() => setShowLogSheet(true)}
            style={styles.fab}
          >
            <Plus size={24} color={Colors.bg} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          <StatCard icon={BarChart2} label="Total" value={activities.length} unit="sessions" />
          <StatCard icon={Timer} label="Duration" value={totalDuration} unit="min" />
          <StatCard icon={Flame} label="Calories" value={totalCalories} unit="kcal" />
        </View>

        {/* Activity list */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.textMuted} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={activities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ActivityCard activity={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.textMuted}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Activity size={32} color={Colors.textFaint} />
                <Text style={styles.emptyTitle}>No activities yet</Text>
                <Text style={styles.emptySubtitle}>Tap + to log your first workout</Text>
                <StyledButton
                  title="Log Activity"
                  onPress={() => setShowLogSheet(true)}
                  size="sm"
                  style={styles.emptyBtn}
                />
              </View>
            }
            contentContainerStyle={
              activities.length === 0
                ? styles.emptyContainer
                : styles.listContent
            }
          />
        )}
      </View>

      <LogActivitySheet
        visible={showLogSheet}
        onClose={() => setShowLogSheet(false)}
        onActivityAdded={() => {
          setShowLogSheet(false);
          fetchActivities();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    paddingTop: Spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[5],
  },
  greeting: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[6],
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: Spacing[5],
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: Spacing[3],
  },
  emptyTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textFaint,
  },
  emptyBtn: { marginTop: Spacing[2] },
});
