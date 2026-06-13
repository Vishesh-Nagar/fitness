import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Activity } from 'lucide-react-native';
import { register, login } from '@/api/api';
import { setCredentials } from '@/store/authSlice';
import StyledButton from '@/components/ui/StyledButton';
import StyledInput from '@/components/ui/StyledInput';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleRegister = async () => {
    setError('');
    if (!form.firstName || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password);
      // Auto-login after registration
      const { data } = await login(form.email, form.password);
      dispatch(setCredentials({ token: data.token, userId: data.userId, email: data.email }));
    } catch (err: any) {
      const status = err?.response?.status;
      setError(
        status === 409
          ? 'An account with this email already exists.'
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logo}>
          <Activity size={20} color={Colors.accent} strokeWidth={2} />
          <Text style={styles.logoText}>Fitness</Text>
        </View>

        {/* Headline */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Start tracking{'\n'}from day one.</Text>
          <Text style={styles.heroSubtitle}>
            Create your account and begin logging workouts in seconds. No setup required.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create account</Text>
          <Text style={styles.cardSubtitle}>Fill in the details below to get started</Text>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={styles.half}>
                <StyledInput
                  label="First Name"
                  placeholder="Jane"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChangeText={set('firstName')}
                />
              </View>
              <View style={styles.half}>
                <StyledInput
                  label="Last Name"
                  placeholder="Doe"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChangeText={set('lastName')}
                />
              </View>
            </View>

            <StyledInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={form.email}
              onChangeText={set('email')}
            />
            <StyledInput
              label="Password"
              placeholder="Min. 6 characters"
              secureTextEntry
              autoComplete="new-password"
              value={form.password}
              onChangeText={set('password')}
            />

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <StyledButton
              title="Create account"
              onPress={handleRegister}
              loading={loading}
              size="lg"
              style={styles.submitBtn}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing[10],
  },
  logoText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  heroSection: {
    marginBottom: Spacing[10],
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: Spacing[2],
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    padding: Spacing[6],
    marginBottom: Spacing[6],
  },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing[6],
  },
  form: {
    gap: Spacing[4],
  },
  nameRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  half: { flex: 1 },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.md,
    padding: Spacing[3],
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
  },
  submitBtn: {
    marginTop: Spacing[1],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  footerLink: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
});
