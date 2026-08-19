import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen, TextInput } from '../components';
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

          <View style={styles.options}>
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <Button
                key={mode}
                title={mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'}
                variant={themeMode === mode ? 'primary' : 'secondary'}
                onPress={() => setThemeMode(mode)}
                style={styles.optionButton}
              />
            ))}
          </View>

          <TextInput
            value={themeMode}
            onChangeText={() => undefined}
            editable={false}
            style={styles.input}
          />
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
  options: {
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    marginBottom: 8,
  },
  input: {
    marginTop: 8,
  },
});
