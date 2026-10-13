import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Sizes, Spacing } from '../../theme';
import { ConfirmationMessage } from '../../molecules';
import { useJornada } from '../../hooks';

export function NotificationBanner() {
  const { notification, dismissNotification } = useJornada();

  if (!notification) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <ConfirmationMessage notification={notification} onDismiss={dismissNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: Sizes.contentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
});
