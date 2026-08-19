import { useColorScheme, type ColorSchemeName } from 'react-native';
import { useThemeStore } from '../store';
import { darkTheme, lightTheme, type AppTheme, type ThemeMode } from './theme';

export function resolveTheme(mode: ThemeMode, systemScheme: ColorSchemeName | null): AppTheme {
  const isDarkSystem = systemScheme === 'dark';
  const isDarkMode = mode === 'system' ? isDarkSystem : mode === 'dark';

  return isDarkMode ? darkTheme : lightTheme;
}

export function useTheme() {
  const systemScheme = useColorScheme() ?? 'light';
  const themeMode = useThemeStore((state) => state.themeMode);
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const theme = resolveTheme(themeMode, systemScheme);

  return {
    ...theme,
    isDark,
    colors: theme.colors,
  };
}
