export type HabitPriority = 'low' | 'medium' | 'high';
export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  priority: HabitPriority;
  color: string;
  icon: string;
  createdAt: string;
  isActive: boolean;
  frequency: HabitFrequency;
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface DailyCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
}

export interface AppSettings {
  darkMode: true;
  notificationsEnabled: boolean;
  language: string;
}
