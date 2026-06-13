import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import SecureStore from '@/utils/storage';
import { store } from '@/store/store';
import { hydrateAuth } from '@/store/authSlice';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate Redux auth state from SecureStore on cold boot
    const boot = async () => {
      try {
        const [token, userId, userEmail] = await Promise.all([
          SecureStore.getItemAsync('token'),
          SecureStore.getItemAsync('userId'),
          SecureStore.getItemAsync('userEmail'),
        ]);
        store.dispatch(hydrateAuth({ token, userId, userEmail }));
      } catch {
        // No stored credentials — stay logged out
      } finally {
        setReady(true);
      }
    };
    boot();
  }, []);

  if (!ready) return null;

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </Provider>
  );
}
