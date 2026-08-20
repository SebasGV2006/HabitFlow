import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CompletionRecord, Habit } from '../types';

interface HabitsState {
  habits: Habit[];
  completionRecords: CompletionRecord[];
  hasHydrated: boolean;
  createHabit: (habit: Omit<Habit, 'id' | 'fechaCreacion'> & { id?: string; fechaCreacion?: string }) => Habit;
  updateHabit: (habitId: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
}

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [],
      completionRecords: [],
      hasHydrated: false,

      createHabit: (habitInput) => {
        const now = new Date().toISOString();
        const newHabit: Habit = {
          id: habitInput.id ?? makeId(),
          nombre: habitInput.nombre,
          descripcion: habitInput.descripcion,
          icono: habitInput.icono,
          color: habitInput.color,
          metaSemanal: Math.min(7, Math.max(1, habitInput.metaSemanal)),
          horaRecordatorio: habitInput.horaRecordatorio,
          fechaCreacion: habitInput.fechaCreacion ?? now,
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
        }));

        return newHabit;
      },

      updateHabit: (habitId, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  ...updates,
                  metaSemanal: updates.metaSemanal ? Math.min(7, Math.max(1, updates.metaSemanal)) : habit.metaSemanal,
                }
              : habit,
          ),
        }));
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== habitId),
          completionRecords: state.completionRecords.filter((record) => record.habitId !== habitId),
        }));
      },

      toggleHabitCompletion: (habitId, date) => {
        set((state) => {
          const existingRecord = state.completionRecords.find(
            (record) => record.habitId === habitId && record.fecha === date,
          );

          if (existingRecord) {
            return {
              completionRecords: state.completionRecords.filter(
                (record) => !(record.habitId === habitId && record.fecha === date),
              ),
            };
          }

          const newRecord: CompletionRecord = {
            id: makeId(),
            habitId,
            fecha: date,
          };

          return {
            completionRecords: [...state.completionRecords, newRecord],
          };
        });
      },
    }),
    {
      name: 'habitflow-habits-storage',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        setTimeout(() => {
          useHabitsStore.setState({ hasHydrated: true });
        }, 0);
      },
    },
  ),
);
