import { Platform } from 'react-native';
import * as ExpoSecureStore from 'expo-secure-store';

const SecureStore = {
  getItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(key);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
      return null;
    }
    return await ExpoSecureStore.getItemAsync(key);
  },
  setItemAsync: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
      return Promise.resolve();
    }
    return await ExpoSecureStore.setItemAsync(key, value);
  },
  deleteItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
      return Promise.resolve();
    }
    return await ExpoSecureStore.deleteItemAsync(key);
  }
};

export default SecureStore;
