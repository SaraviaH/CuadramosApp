import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon, IconName } from '../../atoms';
import { NotificationMessage } from '../../services';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';

interface Props {
  notification: NotificationMessage;
  onDismiss: () => void;
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
    bg: Colors.successSoft,
    border: Colors.success,
    icon: 'check',
    iconColor: Colors.success,
    textColor: Colors.success,
    title: 'OPERACIÓN EXITOSA',
  },
  error: {
    bg: Colors.dangerSoft,
    border: Colors.danger,
    icon: 'alert',
    iconColor: Colors.danger,
    textColor: Colors.danger,
    title: 'ATENCIÓN REQUERIDA',
  },
  info: {
    bg: Colors.brandSoft,
    border: Colors.brand,
    icon: 'info',
    iconColor: Colors.brand,
    textColor: Colors.brandDark,
    title: 'INFORMACIÓN',
  },
};

export function ConfirmationMessage({ notification, onDismiss }: Props) {
  const config = configMap[notification.kind] ?? configMap.info;

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }]}>
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar notificación"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        onPress={onDismiss}
        style={({ pressed }) => [styles.closeButton, { opacity: pressed ? 0.6 : 1 }]}
      >
        <AppText variant="heading" color={config.textColor} style={styles.closeText}>
          ×
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    ...Shadows.sm,
    marginBottom: Spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    letterSpacing: 0.6,
  },
  closeButton: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: Typography.heading.fontSize,
    lineHeight: 22,
  },
});
