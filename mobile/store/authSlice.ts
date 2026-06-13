import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SecureStore from '@/utils/storage';

// SecureStore is synchronous for reading (getItem) but async for writes.
// We boot from in-memory state; the interceptor reads SecureStore async per-request.
interface AuthState {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
}

const initialState: AuthState = {
  token: null,
  userId: null,
  userEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userId: string; email: string }>
    ) => {
      const { token, userId, email } = action.payload;
      state.token = token;
      state.userId = userId;
      state.userEmail = email;
      // Persist to OS keychain (async — fire-and-forget)
      SecureStore.setItemAsync('token', token).catch(console.error);
      SecureStore.setItemAsync('userId', userId).catch(console.error);
      SecureStore.setItemAsync('userEmail', email).catch(console.error);
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.userEmail = null;
      SecureStore.deleteItemAsync('token').catch(console.error);
      SecureStore.deleteItemAsync('userId').catch(console.error);
      SecureStore.deleteItemAsync('userEmail').catch(console.error);
    },
    // Hydrate state after reading from SecureStore on app boot
    hydrateAuth: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
    },
  },
});

export const { setCredentials, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
