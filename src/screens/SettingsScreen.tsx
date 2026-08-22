import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Screen } from '../components';
import { useThemeStore } from '../store';
import { useTheme } from '../theme';

export default function SettingsScreen() {
  const { colors, typography } = useTheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);

  return (
    <Screen>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.title }]}>Ajustes</Text>
          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.caption }]}>Tema</Text>

          <View style={[styles.segmentedControl, { borderColor: colors.border, backgroundColor: colors.surface }]} accessibilityRole="tablist">
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <Pressable
                key={mode}
                accessibilityRole="tab"
                accessibilityState={{ selected: themeMode === mode }}
                accessibilityLabel={`Usar tema ${mode === 'system' ? 'del sistema' : mode === 'light' ? 'claro' : 'oscuro'}`}
                onPress={() => setThemeMode(mode)}
                style={[styles.segment, { backgroundColor: themeMode === mode ? colors.primary : 'transparent' }]}
              >
                <Text style={[styles.segmentText, { color: themeMode === mode ? '#FFFFFF' : colors.textPrimary }]}>
                  {mode === 'system' ? 'Sistema' : mode === 'light' ? 'Claro' : 'Oscuro'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontWeight: '700',
  },
});
