import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User, Mail, Shield } from 'lucide-react-native';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { userEmail, userId } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={28} color={Colors.accent} />
          </View>
          <Text style={styles.emailLarge}>{userEmail ?? 'User'}</Text>
          <View style={styles.userIdRow}>
            <Shield size={11} color={Colors.textFaint} />
            <Text style={styles.userId}>{userId ?? '—'}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Mail size={14} color={Colors.textFaint} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userEmail ?? '—'}</Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>About</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutKey}>Version</Text>
            <Text style={styles.aboutVal}>1.0.0</Text>
          </View>
          <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.aboutKey}>Mode</Text>
            <Text style={[styles.aboutVal, { color: Colors.accent }]}>
              {process.env.EXPO_PUBLIC_MOCK_MODE === 'true' ? 'Mock' : 'Live'}
            </Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
        >
          <LogOut size={16} color={Colors.error} />
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: {
    paddingHorizontal: Spacing[5],
    paddingBottom: 40,
    paddingTop: Spacing[4],
  },
  header: {
    marginBottom: Spacing[6],
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing[8],
    gap: Spacing[2],
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentBg,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[1],
  },
  emailLarge: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  userIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userId: {
    fontSize: FontSize.xs,
    color: Colors.textFaint,
    fontFamily: 'monospace',
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    marginBottom: Spacing[4],
  },
  cardHeader: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textFaint,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  aboutKey: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  aboutVal: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginTop: Spacing[4],
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
});
