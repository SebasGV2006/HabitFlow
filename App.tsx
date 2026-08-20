import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useTheme } from './src/theme';
import { useHabitsStore } from './src/store';
import { configureNotifications, scheduleHabitReminder } from './src/utils';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const { colors, isDark } = useTheme();
  const hasHydrated = useHabitsStore((state) => state.hasHydrated);

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

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
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

  if (!hasHydrated) {
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
