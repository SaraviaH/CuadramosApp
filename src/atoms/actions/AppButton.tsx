import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Sizes, Spacing } from '../../theme';
import { AppText } from '../display/AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'outline';

interface Props {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}

const palette: Record<ButtonVariant, { background: string; text: string; border?: string }> = {
  primary: { background: Colors.brand, text: Colors.white },
  secondary: { background: Colors.brandSoft, text: Colors.brandDark },
  accent: { background: Colors.accent, text: Colors.text },
  danger: { background: Colors.danger, text: Colors.white },
  ghost: { background: 'transparent', text: Colors.textMuted, border: Colors.border },
  outline: { background: 'transparent', text: Colors.brand, border: Colors.brand },
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}: Props) {
  const colors = palette[variant];
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary && !disabled ? Shadows.button : undefined,
        {
          backgroundColor: colors.background,
          borderColor: colors.border ?? colors.background,
          opacity: disabled ? 0.45 : pressed ? 0.86 : 1,
          transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <AppText variant="label" color={colors.text} style={styles.icon}>
              {icon}
            </AppText>
          ) : null}
          <AppText variant="label" color={colors.text}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: Sizes.buttonHeight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 16,
    lineHeight: 18,
  },
});

