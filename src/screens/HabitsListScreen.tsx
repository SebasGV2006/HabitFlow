import React, { useRef } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen } from '../components';
import { useTheme } from '../theme';
import { useHabitsStore } from '../store';
import { getWeeklyProgress, isHabitCompletedToday, calculateHabitStreaks } from '../utils';
import type { Habit } from '../types';

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HabitsListScreen() {
  const navigation = useNavigation<any>();
  const { colors, typography, spacing } = useTheme();
  const habits = useHabitsStore((state) => state.habits);
  const completionRecords = useHabitsStore((state) => state.completionRecords);
  const toggleHabitCompletion = useHabitsStore((state) => state.toggleHabitCompletion);
  const todayKey = formatDateKey(new Date());

  return (
    <Screen>
      <View style={styles.container}>
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontSize: typography.title }]}>No hay hábitos todavía</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: typography.body }]}>
              Crea tu primer hábito para empezar a llevar tu progreso.
            </Text>
            <Button
              title="Crear el primero"
              onPress={() => navigation.navigate('HabitDetail')}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <HabitListItem
                habit={item}
                completionRecords={completionRecords}
                todayKey={todayKey}
                onOpen={() => navigation.navigate('HabitDetail', { habitId: item.id })}
                onToggle={() => toggleHabitCompletion(item.id, todayKey)}
                spacing={spacing.sm}
                colors={colors}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Crear hábito"
          onPress={() => navigation.navigate('HabitDetail')}
          style={[styles.fab, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      </View>
    </Screen>
  );
}

type HabitListItemProps = {
  habit: Habit;
  completionRecords: ReturnType<typeof useHabitsStore.getState>['completionRecords'];
  todayKey: string;
  onOpen: () => void;
  onToggle: () => void;
  spacing: number;
  colors: ReturnType<typeof useTheme>['colors'];
};

function HabitListItem({ habit, completionRecords, onOpen, onToggle, spacing, colors }: HabitListItemProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const weeklyProgress = getWeeklyProgress(habit, completionRecords);
  const completedToday = isHabitCompletedToday(habit, completionRecords, new Date());
  const streaks = calculateHabitStreaks(habit, completionRecords);

  const handleToggle = () => {
    onToggle();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.16, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Editar hábito ${habit.nombre}`}
      onPress={onOpen}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <Card style={[styles.habitCard, { marginBottom: spacing, borderColor: colors.border }]}> 
        <View style={styles.habitRow}>
          <View style={[styles.iconBadge, { backgroundColor: habit.color + '22', borderColor: habit.color }]}>
            <Ionicons accessibilityLabel={`Icono de ${habit.nombre}`} name={habit.icono as any} size={22} color={habit.color} />
          </View>

          <View style={styles.habitInfo}>
            <Text style={[styles.habitName, { color: colors.textPrimary }]}>{habit.nombre}</Text>
            <Text style={[styles.habitProgress, { color: colors.textSecondary }]}>
              {weeklyProgress.completedCount} de {weeklyProgress.metaSemanal} esta semana
            </Text>
            <Text style={[styles.habitStreak, { color: colors.success }]}>Racha: {streaks.currentStreak} semanas</Text>
          </View>

          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={completedToday ? `Desmarcar ${habit.nombre} de hoy` : `Marcar ${habit.nombre} como cumplido hoy`}
              onPress={handleToggle}
              style={[
                styles.checkButton,
                {
                  backgroundColor: completedToday ? habit.color : colors.surface,
                  borderColor: habit.color,
                },
              ]}
            >
              <Ionicons name={completedToday ? 'checkmark' : 'checkmark-outline'} size={18} color={completedToday ? '#FFFFFF' : habit.color} />
            </Pressable>
          </Animated.View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  habitCard: {
    borderWidth: 1,
    borderRadius: 16,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  habitProgress: {
    fontSize: 13,
    marginBottom: 2,
  },
  habitStreak: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    minWidth: 180,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
