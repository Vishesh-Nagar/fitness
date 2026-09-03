import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
}

interface SetCredentialsPayload {
  token: string;
  userId: string;
  email: string;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  userEmail: localStorage.getItem('userEmail'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { token, userId, email } = action.payload;
      state.token = token;
      state.userId = userId;
      state.userEmail = email;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.userEmail = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
