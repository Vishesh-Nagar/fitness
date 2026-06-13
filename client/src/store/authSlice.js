import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    userEmail: localStorage.getItem('userEmail') || null,
  },
  reducers: {
    setCredentials: (state, action) => {
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