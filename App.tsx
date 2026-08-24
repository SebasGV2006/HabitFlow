import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useTheme } from './src/theme';
import { useHabitsStore } from './src/store';
import { configureNotifications, scheduleHabitReminder } from './src/utils';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const { colors, isDark, typography } = useTheme();
  const hasHydrated = useHabitsStore((state) => state.hasHydrated);
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let cancelled = false;

    const initializeNotifications = async () => {
      const granted = await configureNotifications();
      if (!granted || cancelled) {
        return;
      }

      const habitsWithReminders = useHabitsStore
        .getState()
        .habits
        .filter((habit) => habit.horaRecordatorio);

      await Promise.all(habitsWithReminders.map(scheduleHabitReminder));
    };

    void initializeNotifications();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated]);

  const navigationTheme: Theme = isDark
    ? {
        ...DarkTheme,
        fonts: {
          regular: { fontFamily: typography.fontFamily, fontWeight: '400' },
          medium: { fontFamily: typography.fontFamily, fontWeight: '500' },
          bold: { fontFamily: typography.fontFamily, fontWeight: '700' },
          heavy: { fontFamily: typography.fontFamily, fontWeight: '700' },
        },
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        fonts: {
          regular: { fontFamily: typography.fontFamily, fontWeight: '400' },
          medium: { fontFamily: typography.fontFamily, fontWeight: '500' },
          bold: { fontFamily: typography.fontFamily, fontWeight: '700' },
          heavy: { fontFamily: typography.fontFamily, fontWeight: '700' },
        },
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.primary,
        },
      };

  if (!hasHydrated || !fontsLoaded) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
