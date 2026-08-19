export type HabitIcon = string;
export type HabitColor = string;

export interface Habit {
  id: string;
  nombre: string;
  descripcion?: string;
  icono: HabitIcon;
  color: HabitColor;
  metaSemanal: number;
  fechaCreacion: string;
}

export interface CompletionRecord {
  id: string;
  habitId: string;
  fecha: string;
}
