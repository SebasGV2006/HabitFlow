import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Habit } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const HABIT_REMINDERS_CHANNEL_ID = 'habit-reminders';

export async function configureNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(HABIT_REMINDERS_CHANNEL_ID, {
      name: 'Recordatorios de hábitos',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  if (currentPermissions.status === Notifications.PermissionStatus.UNDETERMINED) {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    return requestedPermissions.granted;
  }

  return currentPermissions.granted;
}

function parseReminderTime(value: string): { hour: number; minute: number } | null {
  const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(value);
  if (!match) {
    return null;
  }

  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

export async function scheduleHabitReminder(habit: Habit): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(habit.id);

  if (!habit.horaRecordatorio || !(await configureNotifications())) {
    return;
  }

  const reminderTime = parseReminderTime(habit.horaRecordatorio);
  if (!reminderTime) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: habit.id,
    content: {
      title: 'Recordatorio de hábito',
      body: `Es hora de completar: ${habit.nombre}`,
      sound: 'default',
    },
    trigger: Platform.OS === 'android'
      ? {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: reminderTime.hour,
          minute: reminderTime.minute,
          channelId: HABIT_REMINDERS_CHANNEL_ID,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: reminderTime.hour,
          minute: reminderTime.minute,
          repeats: true,
        },
  });
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(habitId);
}

export function isValidReminderTime(value: string): boolean {
  return parseReminderTime(value) !== null;
}