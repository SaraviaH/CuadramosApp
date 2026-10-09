import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Sizes, Spacing } from '../../theme';
import { AppText } from '../display/AppText';
import { Icon, IconName } from '../display/Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'outline';
export type ButtonTone = 'magenta' | 'green' | 'red' | 'orange';

interface Props {
  label?: string;
  children?: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconName?: IconName;
  showChevron?: boolean;
  style?: ViewStyle;
}

const toneBackgrounds: Record<ButtonTone, { bg: string; shadow?: object }> = {
  magenta: { bg: Colors.brand, shadow: Shadows.button },
  green: { bg: Colors.green, shadow: { shadowColor: Colors.green, shadowOpacity: 0.18, shadowRadius: 8, elevation: 3 } },
  red: { bg: Colors.red, shadow: { shadowColor: Colors.red, shadowOpacity: 0.18, shadowRadius: 8, elevation: 3 } },
  orange: { bg: Colors.orange, shadow: { shadowColor: Colors.orange, shadowOpacity: 0.18, shadowRadius: 8, elevation: 3 } },
};

const palette: Record<ButtonVariant, { background: string; text: string; border?: string }> = {
  primary: { background: Colors.brand, text: Colors.white },
  secondary: { background: Colors.brandSoft, text: Colors.brandDark },
  accent: { background: Colors.accent, text: Colors.ink },
  danger: { background: Colors.red, text: Colors.white },
  ghost: { background: 'transparent', text: Colors.muted, border: Colors.border },
  outline: { background: 'transparent', text: Colors.brand, border: Colors.brand },
};

export function AppButton({
  label,
  children,
  onPress,
  variant = 'primary',
  tone,
  disabled = false,
  loading = false,
  icon,
  iconName,
  showChevron = false,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const effectiveBg = tone ? toneBackgrounds[tone].bg : palette[variant].background;
  const effectiveTextColor = tone ? Colors.white : palette[variant].text;
  const effectiveShadow = tone ? toneBackgrounds[tone].shadow : isPrimary && !disabled ? Shadows.button : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        effectiveShadow,
        {
          backgroundColor: effectiveBg,
          borderColor: palette[variant].border ?? effectiveBg,
          opacity: disabled ? 0.45 : pressed ? 0.86 : 1,
          transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={effectiveTextColor} size="small" />
      ) : (
        <View style={styles.content}>
          {iconName ? (
            <Icon name={iconName} color={effectiveTextColor} size={18} />
          ) : icon ? (
            <AppText variant="label" color={effectiveTextColor} style={styles.icon}>
              {icon}
            </AppText>
          ) : null}

          {children ? (
            typeof children === 'string' || typeof children === 'number' || Array.isArray(children) ? (
              <AppText variant="label" color={effectiveTextColor} style={styles.label}>
                {children}
              </AppText>
            ) : (
              children
            )
          ) : label ? (
            <AppText variant="label" color={effectiveTextColor} style={styles.label}>
              {label}
            </AppText>
          ) : null}

          {showChevron && (
            <AppText variant="label" color={effectiveTextColor} style={styles.chevron}>
              ›
            </AppText>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: Sizes.buttonHeight,
    ...Radius.asymmetricButton,
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
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  icon: {
    fontSize: 16,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '800',
    opacity: 0.8,
    marginLeft: 4,
  },
});
