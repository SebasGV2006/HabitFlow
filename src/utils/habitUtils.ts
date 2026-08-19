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

const getDateKey = (value: string | Date): string => {
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
  const currentWeekDates = getWeekDates(referenceDate).map((date) => toLocalDateString(date));

  const isCompletedWeekForDate = (weekDate: Date) => {
    const weekKeyDates = getWeekDates(weekDate).map((date) => toLocalDateString(date));
    const weekCount = completionRecords.filter(
      (record) => record.habitId === habit.id && weekKeyDates.includes(record.fecha),
    ).length;
    return weekCount >= habit.metaSemanal;
  };

  const completedWeeks: Date[] = [];
  const cursor = new Date(weekStart);
  cursor.setDate(cursor.getDate() - 7);

  while (cursor >= new Date(weekStart.getTime() - 365 * 24 * 60 * 60 * 1000)) {
    if (isCompletedWeekForDate(cursor)) {
      completedWeeks.push(new Date(cursor));
    } else {
      break;
    }
    cursor.setDate(cursor.getDate() - 7);
  }

  const currentStreak = completedWeeks.length;

  const allWeeks: Date[] = [];
  const scanDate = new Date(referenceDate);
  scanDate.setHours(0, 0, 0, 0);
  const earliestWeek = new Date(scanDate);
  earliestWeek.setDate(earliestWeek.getDate() - 365);

  for (let cursorWeek = new Date(scanDate); cursorWeek >= earliestWeek; cursorWeek.setDate(cursorWeek.getDate() - 7)) {
    if (cursorWeek.getDay() === 1 || cursorWeek.getDay() === 0) {
      allWeeks.push(new Date(cursorWeek));
    }
  }

  const weeklyResults = allWeeks
    .map((weekDate) => {
      const weekKeyDates = getWeekDates(weekDate).map((date) => toLocalDateString(date));
      const count = completionRecords.filter(
        (record) => record.habitId === habit.id && weekKeyDates.includes(record.fecha),
      ).length;
      return { weekDate, full: count >= habit.metaSemanal };
    })
    .filter((entry) => entry.full)
    .map((entry) => entry.weekDate);

  let longestStreak = 0;
  let streakCounter = 0;
  let lastDate: Date | null = null;

  for (const weekDate of weeklyResults.slice().reverse()) {
    if (!lastDate) {
      streakCounter = 1;
      lastDate = weekDate;
      longestStreak = 1;
      continue;
    }

    const diffDays = Math.round((lastDate.getTime() - weekDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 7) {
      streakCounter += 1;
      longestStreak = Math.max(longestStreak, streakCounter);
    } else {
      streakCounter = 1;
    }
    lastDate = weekDate;
  }

  const currentWeekIsComplete = currentWeekDates.every((dateKey) => {
    const recordForDate = completionRecords.some(
      (record) => record.habitId === habit.id && record.fecha === dateKey,
    );
    return recordForDate;
  });

  return {
    currentStreak: currentWeekIsComplete ? currentStreak + 1 : currentStreak,
    longestStreak: longestStreak === 0 ? 0 : longestStreak,
  };
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
  return getDateKey(value);
}
