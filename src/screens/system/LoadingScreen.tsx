import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { AppText } from '../../atoms';
import { Colors, Spacing } from '../../theme';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          source={require('../../assets/images/yupay-logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Yupay"
        />
      </View>
      <ActivityIndicator size="large" color={Colors.brand} style={styles.spinner} />
      <AppText variant="body" color={Colors.muted} style={styles.message}>
        Preparando tu caja diaria...
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
    padding: Spacing.md,
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  brandLogo: {
    width: 220,
    height: 73,
  },
  spinner: {
    marginVertical: Spacing.xs,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
  },
});
