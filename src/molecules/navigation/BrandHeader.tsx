import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';

export function BrandHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Compartamos Banco"
        />
        <View style={styles.brandCopy}>
          <AppText style={styles.brandTitle}>COMPARTAMOS</AppText>
          <AppText style={styles.brandSubtitle}>BANCO</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  brandLogo: {
    width: 64,
    height: 64,
  },
  brandCopy: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: Typography.title.fontSize,
    letterSpacing: 1.4,
    fontWeight: '900',
    color: Colors.brand,
    lineHeight: 25,
  },
  brandSubtitle: {
    fontSize: Typography.label.fontSize,
    letterSpacing: 3.5,
    fontWeight: '800',
    color: Colors.muted,
    marginTop: 3,
  },
});