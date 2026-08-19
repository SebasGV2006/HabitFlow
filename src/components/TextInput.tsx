import React from 'react';
import { StyleSheet, TextInput as RNTextInput, type TextInputProps } from 'react-native';
import { useTheme } from '../theme';

export function TextInput({ style, ...props }: TextInputProps) {
  const { colors, spacing } = useTheme();

  return (
    <RNTextInput
      {...props}
      placeholderTextColor={colors.textSecondary}
      style={[
        styles.input,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.textPrimary,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
});
