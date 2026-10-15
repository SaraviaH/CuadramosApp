import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon, IconName } from '../../atoms';
import { NotificationMessage } from '../../services';
import { Colors, Radius, Spacing } from '../../theme';

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
  }
> = {
  success: {
    bg: '#EAF7EE',
    border: '#BFE6C9',
    icon: 'check',
    iconColor: Colors.green,
    textColor: Colors.text,
  },
  error: {
    bg: '#FDF0F0',
    border: '#F8C8C8',
    icon: 'alert',
    iconColor: Colors.red,
    textColor: Colors.red,
  },
  info: {
    bg: Colors.brandSoft,
    border: Colors.border,
    icon: 'info',
    iconColor: Colors.brand,
    textColor: Colors.text,
  },
};

export function ConfirmationMessage({ notification, onDismiss, autoDismissMs = 3000 }: Props) {
  const config = configMap[notification.kind] ?? configMap.info;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Entrada discreta
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    if (!autoDismissMs) return;

    const timer = setTimeout(() => {
      // Salida discreta
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss();
      });
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [notification, onDismiss, autoDismissMs, opacity, translateY]);

  const handleManualDismiss = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  return (
    <Animated.View
      style={[
        styles.toastWrap,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        accessibilityRole="alert"
        accessibilityLabel={notification.message}
        accessibilityHint="Toca para descartar"
        onPress={handleManualDismiss}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: config.bg,
            borderColor: config.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={styles.iconBox}>
          <Icon name={config.icon} color={config.iconColor} size={16} />
        </View>
        <AppText style={[styles.messageText, { color: config.textColor }]} numberOfLines={2}>
          {notification.message}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastWrap: {
    maxWidth: 420,
    width: '92%',
    alignSelf: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
