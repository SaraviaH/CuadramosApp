import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ConfirmationMessage } from '../../molecules';
import { useJornada } from '../../hooks';

interface Props {
  hasBottomNav?: boolean;
}

export function NotificationBanner({ hasBottomNav = true }: Props) {
  const { notification, dismissNotification } = useJornada();

  if (!notification) {
    return null;
  }

  return (
    <View
      style={[
        styles.absoluteOverlay,
        { bottom: hasBottomNav ? 76 : 24 },
      ]}
      pointerEvents="box-none"
    >
      <ConfirmationMessage notification={notification} onDismiss={dismissNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    elevation: 20,
    pointerEvents: 'box-none',
  },
});
