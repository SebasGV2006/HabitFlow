import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components';
import { useTheme } from '../theme';
import { useHabitsStore } from '../store';
import { calculateHabitStreaks } from '../utils';
import type { Habit } from '../types';

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  const offset = (day === 0 ? -6 : 1) - day;
  result.setDate(result.getDate() + offset);
  result.setHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const getHeatmapDates = (referenceDate: Date) => {
  const firstDate = addDays(referenceDate, -83);
  return Array.from({ length: 12 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => addDays(firstDate, weekIndex * 7 + dayIndex)),
  );
};

const getWeeklyDates = (referenceDate: Date) => {
  const currentWeekStart = startOfWeek(referenceDate);
  return Array.from({ length: 8 }, (_, index) => addDays(currentWeekStart, -(7 - index) * 7));
};

const blendColors = (background: string, primary: string, intensity: number) => {
  const parse = (value: string) => {
    const hex = value.replace('#', '');
    const normalized = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex;
    return [0, 2, 4].map((position) => Number.parseInt(normalized.slice(position, position + 2), 16));
  };

  const backgroundRgb = parse(background);
  const primaryRgb = parse(primary);
  const rgb = backgroundRgb.map((channel, index) => Math.round(channel + (primaryRgb[index] - channel) * intensity));
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

const getDayCompletionCount = (date: Date, habits: Habit[], completionRecords: ReturnType<typeof useHabitsStore.getState>['completionRecords']) => {
  const dateKey = toDateKey(date);
  return habits.reduce(
    (count, habit) => count + (completionRecords.some((record) => record.habitId === habit.id && record.fecha === dateKey) ? 1 : 0),
    0,
  );
};

type WeeklyBar = {
  start: Date;
  percentage: number;
};

export default function StatisticsScreen() {
  const { colors, typography } = useTheme();
  const habits = useHabitsStore((state) => state.habits);
  const completionRecords = useHabitsStore((state) => state.completionRecords);
  const referenceDate = new Date();
  const todayKey = toDateKey(referenceDate);
  const activeHabits = habits.filter(
    (habit) => !completionRecords.some((record) => record.habitId === habit.id && record.fecha === todayKey),
  );

  const heatmapWeeks = useMemo(() => getHeatmapDates(referenceDate), [completionRecords, habits]);
  const heatmapCounts = useMemo(
    () => heatmapWeeks.flat().map((date) => getDayCompletionCount(date, habits, completionRecords)),
    [heatmapWeeks, habits, completionRecords],
  );
  const maxHeatmapCount = Math.max(...heatmapCounts, 0);

  const weeklyBars = useMemo<WeeklyBar[]>(() => {
    return getWeeklyDates(referenceDate).map((weekStart) => {
      const weekDates = Array.from({ length: 7 }, (_, index) => toDateKey(addDays(weekStart, index)));
      const completedCount = completionRecords.filter(
        (record) => record.fecha >= weekDates[0] && record.fecha <= weekDates[6] && habits.some((habit) => habit.id === record.habitId),
      ).length;
      const weeklyGoal = habits.reduce((sum, habit) => sum + habit.metaSemanal, 0);

      return {
        start: weekStart,
        percentage: weeklyGoal === 0 ? 0 : Math.min(1, completedCount / weeklyGoal),
      };
    });
  }, [completionRecords, habits]);

  const highestStreak = habits.reduce(
    (highest, habit) => Math.max(highest, calculateHabitStreaks(habit, completionRecords).longestStreak),
    0,
  );
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => addDays(referenceDate, -index));
  const lastSevenDaysCount = completionRecords.filter((record) =>
    lastSevenDays.some((date) => record.fecha === toDateKey(date)),
  ).length;

  if (habits.length === 0) {
    return (
      <Screen>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontSize: typography.title }]}>Aún no hay estadísticas</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: typography.body }]}>Crea un hábito y empieza a marcar tus cumplimientos para ver tu progreso aquí.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.title }]}>Estadísticas</Text>

        <View style={styles.summaryRow}>
          <SummaryCard label="Hábitos activos" value={String(activeHabits.length)} colors={colors} />
          <SummaryCard label="Racha más alta" value={`${highestStreak} sem.`} colors={colors} />
          <SummaryCard label="Últimos 7 días" value={String(lastSevenDaysCount)} colors={colors} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Últimos 84 días</Text>
          <Text style={[styles.sectionCaption, { color: colors.textSecondary }]}>Cumplimientos por día</Text>
          <View style={styles.heatmap}>
            {heatmapWeeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.heatmapRow}>
                {week.map((date, dayIndex) => {
                  const count = heatmapCounts[weekIndex * 7 + dayIndex];
                  const intensity = maxHeatmapCount === 0 ? 0 : Math.max(0.12, count / maxHeatmapCount);
                  return <View key={toDateKey(date)} style={[styles.heatmapCell, { backgroundColor: blendColors(colors.background, colors.primary, intensity) }]} />;
                })}
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Menos</Text>
            {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
              <View key={intensity} style={[styles.legendCell, { backgroundColor: blendColors(colors.background, colors.primary, intensity === 0 ? 0 : Math.max(0.12, intensity)) }]} />
            ))}
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Más</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Progreso semanal</Text>
          <Text style={[styles.sectionCaption, { color: colors.textSecondary }]}>Cumplimientos frente a las metas semanales</Text>
          <View style={styles.chart}>
            {weeklyBars.map((bar) => (
              <View key={toDateKey(bar.start)} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: `${Math.max(4, bar.percentage * 100)}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{bar.start.getDate()}/{bar.start.getMonth() + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function SummaryCard({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    minHeight: 92,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
  section: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCaption: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  heatmap: {
    gap: 5,
  },
  heatmapRow: {
    flexDirection: 'row',
    gap: 5,
  },
  heatmapCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    marginTop: 12,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
  },
  chart: {
    height: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    height: 140,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 5,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  emptyTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
});
