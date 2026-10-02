import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../atoms';
import { NotificationMessage } from '../../services';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

interface Props {
  notification: NotificationMessage;
  onDismiss: () => void;
}

const configMap = {
  success: {
    bg: Colors.successSoft,
    border: Colors.success,
    icon: '✓',
    iconColor: Colors.success,
    textColor: Colors.success,
    title: 'OPERACIÓN EXITOSA',
  },
  error: {
    bg: Colors.dangerSoft,
    border: Colors.danger,
    icon: '✕',
    iconColor: Colors.danger,
    textColor: Colors.danger,
    title: 'ATENCIÓN REQUERIDA',
  },
  info: {
    bg: Colors.brandSoft,
    border: Colors.brand,
    icon: 'ℹ',
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
        <AppText variant="subheading" color={config.iconColor}>
          {config.icon}
        </AppText>
      </View>
      <View style={styles.content}>
        <AppText variant="captionBold" color={config.textColor} style={styles.title}>
          {config.title}
        </AppText>
        <AppText variant="bodyMedium" color={Colors.text} style={styles.message}>
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
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    ...Shadows.sm,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    letterSpacing: 0.5,
  },
  message: {
    lineHeight: 19,
  },
  closeButton: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  closeText: {
    fontSize: 20,
    lineHeight: 22,
  },
});

