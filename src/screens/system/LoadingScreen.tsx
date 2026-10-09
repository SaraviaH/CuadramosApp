import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { AppText } from '../../atoms';
import { Colors, Radius, Spacing } from '../../theme';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Cuadramos"
        />
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
  brandLogo: {
    width: 64,
    height: 64,
    marginBottom: 4,
  },
  brandTitle: {
    letterSpacing: 1.5,
  },
  spinner: {
    marginVertical: Spacing.xs,
  },
});

