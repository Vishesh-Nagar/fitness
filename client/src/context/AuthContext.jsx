import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));

  const login = useCallback(async (email, password) => {
    const { data } = await apiLogin(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userEmail', data.email);
    setToken(data.token);
    setUserId(data.userId);
    setUserEmail(data.email);
    return data;
  }, []);

  const register = useCallback(async (firstName, lastName, email, password) => {
    const { data } = await apiRegister(firstName, lastName, email, password);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUserId(null);
    setUserEmail(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, userId, userEmail, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
