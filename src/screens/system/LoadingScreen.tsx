import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from '../../atoms';
import { Colors, Radius, Spacing } from '../../theme';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <View style={styles.brandIcon}>
          <View style={styles.brandDot} />
        </View>
        <AppText variant="title" color={Colors.brand} style={styles.brandTitle}>
          CUADRAMOS
        </AppText>
      </View>
      <ActivityIndicator size="large" color={Colors.brand} style={styles.spinner} />
      <AppText variant="body" color={Colors.textMuted}>
        Preparando tu caja diaria…
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  logoBox: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
  },
  brandTitle: {
    letterSpacing: 1.5,
  },
  spinner: {
    marginVertical: Spacing.xs,
  },
});

