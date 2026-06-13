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
import { login } from '@/api/api';
import { setCredentials } from '@/store/authSlice';
import StyledButton from '@/components/ui/StyledButton';
import StyledInput from '@/components/ui/StyledInput';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await login(form.email, form.password);
      dispatch(setCredentials({ token: data.token, userId: data.userId, email: data.email }));
    } catch (err: any) {
      const status = err?.response?.status;
      setError(status === 401 ? 'Invalid email or password.' : 'Something went wrong. Please try again.');
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
          <Text style={styles.heroTitle}>Track what matters.</Text>
          <Text style={styles.heroSubtitle}>
            Log workouts, monitor calories, and build consistent habits — all in one place.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in</Text>
          <Text style={styles.cardSubtitle}>Enter your credentials to continue</Text>

          <View style={styles.form}>
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
              placeholder="••••••••"
              secureTextEntry
              autoComplete="current-password"
              value={form.password}
              onChangeText={set('password')}
            />

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <StyledButton
              title="Sign in"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={styles.submitBtn}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>No account? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Create one</Text>
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
