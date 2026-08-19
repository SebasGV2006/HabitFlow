import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components';
import { useTheme } from '../theme';

export default function HabitDetailScreen() {
  const { colors, typography } = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.textPrimary, fontSize: typography.subtitle }]}>Detalle / Formulario de Hábito</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
