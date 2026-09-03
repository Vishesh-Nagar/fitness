import { Tabs, Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { BarChart2, User, PlusCircle } from 'lucide-react-native';
import { RootState } from '@/store/store';
import { Colors } from '@/constants/theme';

export default function AppLayout() {
  const token = useSelector((state: RootState) => state.auth.token);

  // Guard: redirect unauthenticated users to login
  if (!token) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log-activity"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      {/* Hide the dynamic activity route from tab bar */}
      <Tabs.Screen
        name="activity/[id]"
        options={{ href: null }}
      />
    </Tabs>
  );
}
