import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { addActivity } from '@/api/api';
import StyledButton from '@/components/ui/StyledButton';
import StyledInput from '@/components/ui/StyledInput';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { ACTIVITY_TYPES } from '@/constants/theme';

interface LogActivitySheetProps {
  visible: boolean;
  onClose: () => void;
  onActivityAdded: () => void;
}

const INITIAL = {
  type: 'RUNNING',
  duration: '',
  caloriesBurned: '',
};

const LogActivitySheet: React.FC<LogActivitySheetProps> = ({
  visible,
  onClose,
  onActivityAdded,
}) => {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    if (!form.duration) {
      setError('Please enter a duration.');
      return;
    }
    setLoading(true);
    try {
      await addActivity({
        type: form.type,
        duration: parseInt(form.duration, 10),
        caloriesBurned: form.caloriesBurned ? parseInt(form.caloriesBurned, 10) : null,
        startTime: new Date().toISOString(),
      });
      setForm(INITIAL);
      onActivityAdded();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to log activity. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log Activity</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <X size={18} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
            {/* Activity Type Picker */}
            <Text style={styles.fieldLabel}>Activity Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeScroll}
              contentContainerStyle={styles.typeScrollContent}
            >
              {ACTIVITY_TYPES.map((t) => {
                const isSelected = form.type === t.value;
                const accentColor = (Colors as any)[t.value] || Colors.OTHER;
                return (
                  <Pressable
                    key={t.value}
                    onPress={() => set('type')(t.value)}
                    style={[
                      styles.typeChip,
                      isSelected && {
                        backgroundColor: `${accentColor}20`,
                        borderColor: accentColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        isSelected && { color: accentColor },
                      ]}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Duration + Calories */}
            <View style={styles.row}>
              <View style={styles.half}>
                <StyledInput
                  label="Duration (min)"
                  keyboardType="numeric"
                  placeholder="e.g. 30"
                  value={form.duration}
                  onChangeText={set('duration')}
                />
              </View>
              <View style={styles.half}>
                <StyledInput
                  label="Calories (kcal)"
                  keyboardType="numeric"
                  placeholder="e.g. 250"
                  value={form.caloriesBurned}
                  onChangeText={set('caloriesBurned')}
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <StyledButton
              title="Log Activity"
              onPress={handleSubmit}
              loading={loading}
              size="lg"
              style={styles.submitBtn}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingBottom: 40,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  body: {
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[4],
  },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    marginBottom: Spacing[2],
    letterSpacing: 0.3,
  },
  typeScroll: {
    marginBottom: Spacing[5],
  },
  typeScrollContent: {
    gap: Spacing[2],
    paddingRight: Spacing[2],
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  typeChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
  half: { flex: 1 },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.md,
    padding: Spacing[3],
    marginBottom: Spacing[4],
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
  },
  submitBtn: {
    marginBottom: Spacing[4],
  },
});

export default LogActivitySheet;
