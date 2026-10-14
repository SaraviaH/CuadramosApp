import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon, IconName } from '../../atoms';
import { NotificationMessage } from '../../services';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

interface Props {
  notification: NotificationMessage;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const configMap: Record<
  string,
  {
    bg: string;
    border: string;
    icon: IconName;
    iconColor: string;
    textColor: string;
    title: string;
  }
> = {
  success: {
    bg: '#EAF7EE',
    border: '#BFE6C9',
    icon: 'check',
    iconColor: Colors.green,
    textColor: Colors.green,
    title: 'Operación confirmada',
  },
  error: {
    bg: '#FDF0F0',
    border: '#F8C8C8',
    icon: 'alert',
    iconColor: Colors.red,
    textColor: Colors.red,
    title: 'Atención',
  },
  info: {
    bg: Colors.brandSoft,
    border: Colors.border,
    icon: 'info',
    iconColor: Colors.brand,
    textColor: Colors.brandDark,
    title: 'Información',
  },
};

export function ConfirmationMessage({ notification, onDismiss, autoDismissMs = 3500 }: Props) {
  const config = configMap[notification.kind] ?? configMap.info;

  useEffect(() => {
    if (!autoDismissMs) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, autoDismissMs);
    return () => clearTimeout(timer);
  }, [notification, onDismiss, autoDismissMs]);

  return (
    <Pressable
      accessibilityRole="alert"
      accessibilityLabel={notification.message}
      accessibilityHint="Toca para descartar de inmediato"
      onPress={onDismiss}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: Colors.surface }]}>
        <Icon name={config.icon} color={config.iconColor} size={18} />
      </View>
      <View style={styles.content}>
        <AppText variant="captionBold" color={config.textColor} style={styles.title}>
          {config.title}
        </AppText>
        <AppText variant="bodyMedium" color={Colors.text}>
          {notification.message}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    ...Shadows.sm,
    marginBottom: Spacing.xs,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    letterSpacing: 0.2,
  },
});
