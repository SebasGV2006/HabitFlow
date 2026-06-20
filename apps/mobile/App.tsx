import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { STRINGS } from './src/constants/strings';
import { THEME } from './src/constants/theme';

export default function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.card}>
        <Text style={styles.title}>{STRINGS.appTitle}</Text>
        <Text style={styles.subtitle}>{STRINGS.welcome}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: THEME.colors.surface,
    padding: 24,
    borderRadius: 12,
    minWidth: 280
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 14
  }
});
