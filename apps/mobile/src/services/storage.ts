import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  habits: 'habitflow_habits',
  settings: 'habitflow_settings'
} as const;

export const saveValue = async <T>(key: string, value: T): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadValue = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
};
