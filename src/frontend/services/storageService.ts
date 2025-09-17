// src/services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserToStorage = (user: any) =>
  AsyncStorage.setItem('user', JSON.stringify(user));

export const getUserFromStorage = async () => {
  const data = await AsyncStorage.getItem('user');
  return data ? JSON.parse(data) : null;
};

export const clearUserFromStorage = () => AsyncStorage.removeItem('user');

export const setFirstLaunch = () =>
  AsyncStorage.setItem('hasLaunchedBefore', 'true');

export const checkFirstLaunch = () => AsyncStorage.getItem('hasLaunchedBefore');
