import { Stack, Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function AuthLayout() {
  const token = useSelector((state: RootState) => state.auth.token);

  // If already authenticated, redirect to app
  if (token) return <Redirect href="/(app)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0a' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
