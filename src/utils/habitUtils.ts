import type { CompletionRecord, Habit } from '../types';

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStartOfCalendarWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

const getWeekDates = (date: Date): Date[] => {
  const start = getStartOfCalendarWeek(date);
  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current;
  });
};

const normalizeDateKey = (value: string | Date): string => {
  if (value instanceof Date) {
    return toLocalDateString(value);
  }

  return value;
};

export function isHabitCompletedToday(
  habit: Habit,
  completionRecords: CompletionRecord[],
  date: Date = new Date(),
): boolean {
  const targetDate = toLocalDateString(date);

  return completionRecords.some(
    (record) => record.habitId === habit.id && record.fecha === targetDate,
  );
}

export function getWeeklyProgress(
  habit: Habit,
  completionRecords: CompletionRecord[],
  referenceDate: Date = new Date(),
): { completedCount: number; metaSemanal: number; weekDates: string[]; isCompletedWeek: boolean; } {
  const weekDates = getWeekDates(referenceDate).map((date) => toLocalDateString(date));

  const completedCount = completionRecords.filter(
    (record) => record.habitId === habit.id && weekDates.includes(record.fecha),
  ).length;

  return {
    completedCount,
    metaSemanal: habit.metaSemanal,
    weekDates,
    isCompletedWeek: completedCount >= habit.metaSemanal,
  };
}

export function calculateHabitStreaks(
  habit: Habit,
  completionRecords: CompletionRecord[],
  referenceDate: Date = new Date(),
): { currentStreak: number; longestStreak: number } {
  const weekStart = getStartOfCalendarWeek(referenceDate);

  const isCompletedWeekForDate = (weekDate: Date) => {
    const weekKeyDates = getWeekDates(weekDate).map((date) => toLocalDateString(date));
    const weekCount = new Set(
      completionRecords
        .filter((record) => record.habitId === habit.id && weekKeyDates.includes(record.fecha))
        .map((record) => record.fecha),
    ).size;
    return weekCount >= habit.metaSemanal;
  };

  const finalizedWeeks: Date[] = [];
  for (let index = 1; index <= 52; index += 1) {
    const finalizedWeek = new Date(weekStart);
    finalizedWeek.setDate(weekStart.getDate() - index * 7);
    finalizedWeeks.push(finalizedWeek);
  }

  const weeklyResults = finalizedWeeks.map((weekDate) => ({
    weekDate,
    full: isCompletedWeekForDate(weekDate),
  }));

  let currentStreak = 0;
  for (const result of weeklyResults) {
    if (!result.full) break;
    currentStreak += 1;
  }

  let longestStreak = 0;
  let streakCounter = 0;

  for (const result of weeklyResults.slice().reverse()) {
    if (result.full) {
      streakCounter += 1;
      longestStreak = Math.max(longestStreak, streakCounter);
    } else {
      streakCounter = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
  };
}

export function getLastSevenDays(referenceDate: Date = new Date()): Date[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(referenceDate.getDate() - (6 - index));
    return date;
  });
}

export function getDateKey(date: Date): string {
  return toLocalDateString(date);
}

export function getCompletedDatesForWeek(
  habit: Habit,
  completionRecords: CompletionRecord[],
  referenceDate: Date = new Date(),
): string[] {
  const weekDates = getWeekDates(referenceDate).map((date) => toLocalDateString(date));

  return weekDates.filter((dateKey) =>
    completionRecords.some((record) => record.habitId === habit.id && record.fecha === dateKey),
  );
}

export function getHabitCompletionState(
  habit: Habit,
  completionRecords: CompletionRecord[],
  referenceDate: Date = new Date(),
): {
  completedToday: boolean;
  weeklyProgress: number;
  weeklyGoal: number;
  weekDates: string[];
} {
  const weeklyProgressData = getWeeklyProgress(habit, completionRecords, referenceDate);

  return {
    completedToday: isHabitCompletedToday(habit, completionRecords, referenceDate),
    weeklyProgress: weeklyProgressData.completedCount,
    weeklyGoal: weeklyProgressData.metaSemanal,
    weekDates: weeklyProgressData.weekDates,
  };
}

export function getWeekStart(date: Date = new Date()): string {
  return toLocalDateString(getStartOfCalendarWeek(date));
}

export function getDateValue(value: string | Date): string {
  return normalizeDateKey(value);
}
