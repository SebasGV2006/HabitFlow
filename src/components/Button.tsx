import React from 'react';
import { Pressable, StyleSheet, Text, type PressableProps, type PressableStateCallbackType } from 'react-native';
import { useTheme } from '../theme';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
};

export function Button({ title, variant = 'primary', style, ...props }: ButtonProps) {
  const { colors, spacing } = useTheme();

  const isPrimary = variant === 'primary';

  const resolveStyle = (state: PressableStateCallbackType) => [
    styles.base,
    {
      backgroundColor: isPrimary ? colors.primary : colors.surface,
      borderColor: isPrimary ? colors.primary : colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    typeof style === 'function' ? style(state) : style,
  ];

  return (
    <Pressable
      {...props}
      style={resolveStyle}
    >
      <Text
        style={{
          color: isPrimary ? '#FFFFFF' : colors.textPrimary,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
