export const ROUTES = {
  home: 'Home',
  habitDetail: 'HabitDetail',
  newHabit: 'NewHabit',
  settings: 'Settings'
} as const;

export type RouteKey = keyof typeof ROUTES;
