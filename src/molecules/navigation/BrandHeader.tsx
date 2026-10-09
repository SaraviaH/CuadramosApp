import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon } from '../../atoms';

interface Props {
  back?: boolean;
  onBack?: () => void;
}

export function BrandHeader({ back, onBack }: Props) {
  return (
    <View style={styles.header}>
      {back && onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Icon name="arrow" color={Colors.brandDark} size={15} />
          <AppText style={styles.backText}>Volver</AppText>
        </Pressable>
      ) : null}

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
    fontSize: 22,
    letterSpacing: 1.4,
    fontWeight: '900',
    color: Colors.brand,
    lineHeight: 25,
  },
  brandSubtitle: {
    fontSize: 14,
    letterSpacing: 3.5,
    fontWeight: '800',
    color: Colors.muted,
    marginTop: 3,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandSoft,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 2,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
});
