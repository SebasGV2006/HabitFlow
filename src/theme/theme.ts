export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  success: string;
  danger: string;
  border: string;
};

export type TypographyScale = {
  title: number;
  subtitle: number;
  body: number;
  caption: number;
};

export type SpacingScale = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type AppTheme = {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
};

export const lightColors: ThemeColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  primary: '#2F6FED',
  success: '#16A34A',
  danger: '#DC2626',
  border: '#E5E7EB',
};

export const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#111827',
  textPrimary: '#F9FAFB',
  textSecondary: '#94A3B8',
  primary: '#60A5FA',
  success: '#34D399',
  danger: '#F87171',
  border: '#1F2937',
};

export const typography: TypographyScale = {
  title: 28,
  subtitle: 20,
  body: 16,
  caption: 12,
};

export const spacing: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
};
