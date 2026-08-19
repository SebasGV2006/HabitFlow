import { useColorScheme, type ColorSchemeName } from 'react-native';
import { useThemeStore } from '../store';
import { darkTheme, lightTheme, type AppTheme, type ThemeMode } from './theme';

export function resolveTheme(mode: ThemeMode, systemScheme: ColorSchemeName | null): AppTheme {
  if (mode === 'system') {
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }

  return mode === 'dark' ? darkTheme : lightTheme;
}

export function useTheme() {
  const systemScheme = useColorScheme() ?? 'light';
  const themeMode = useThemeStore((state) => state.themeMode);

  const theme = resolveTheme(themeMode, systemScheme);

  return {
    ...theme,
    isDark: theme.mode === 'dark' || (themeMode === 'system' && systemScheme === 'dark'),
    colors: theme.colors,
  };
}
