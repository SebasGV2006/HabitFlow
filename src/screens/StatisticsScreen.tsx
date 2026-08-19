import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components';
import { useTheme } from '../theme';

export default function StatisticsScreen() {
  const { colors, typography } = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.textPrimary, fontSize: typography.subtitle }]}>Estadísticas</Text>
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
