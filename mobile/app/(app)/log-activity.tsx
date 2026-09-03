import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { addActivity } from '@/api/api';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

const ACTIVITY_TYPES = [
  'RUNNING', 'CYCLING', 'SWIMMING', 'WALKING',
  'HIKING', 'YOGA', 'STRENGTH_TRAINING', 'OTHER',
] as const;

type ActivityType = typeof ACTIVITY_TYPES[number];

export default function LogActivityScreen() {
  const [type, setType] = useState<ActivityType>('RUNNING');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const dur = parseInt(duration, 10);
    const cal = parseInt(calories, 10);

    if (!dur || dur < 1) {
      Alert.alert('Validation', 'Duration must be at least 1 minute.');
      return;
    }
    if (isNaN(cal) || cal < 0) {
      Alert.alert('Validation', 'Calories burned cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      await addActivity({
        type,
        duration: dur,
        caloriesBurned: cal,
        startTime: new Date().toISOString(),
      });
      Alert.alert('Logged!', 'Activity saved. AI recommendation coming soon.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not save activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [type, duration, calories]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>Log Activity</Text>
          <Text style={styles.subtitle}>Track your workout details</Text>

          {/* Type picker */}
          <Text style={styles.label}>Activity Type</Text>
          <View style={styles.typeGrid}>
            {ACTIVITY_TYPES.map(t => (
              <Pressable
                key={t}
                style={[styles.typeChip, type === t && styles.typeChipActive]}
                onPress={() => setType(t)}
                accessibilityRole="radio"
                accessibilityState={{ selected: type === t }}
              >
                <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>
                  {t.replace('_', ' ')}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Duration */}
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 30"
            placeholderTextColor={Colors.textFaint}
            keyboardType="numeric"
            returnKeyType="next"
            accessibilityLabel="Duration in minutes"
          />

          {/* Calories */}
          <Text style={styles.label}>Calories Burned</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder="e.g. 300"
            placeholderTextColor={Colors.textFaint}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            accessibilityLabel="Calories burned"
          />

          {/* Submit */}
          <Pressable
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Log activity"
          >
            {submitting ? (
              <ActivityIndicator size="small" color={Colors.bg} />
            ) : (
              <Text style={styles.buttonText}>Log Activity</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: Spacing.lg, paddingBottom: 40 },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '22',
  },
  typeChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  typeChipTextActive: {
    color: Colors.accent,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  button: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.bg,
  },
});
