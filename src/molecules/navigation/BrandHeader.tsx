import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon } from '../../atoms';

interface Props {
  back?: boolean;
  onBack?: () => void;
  variant?: 'default' | 'compact-left';
  tone?: 'light' | 'brand';
}

export function BrandHeader({ back, onBack, variant = 'default', tone = 'light' }: Props) {
  if (variant === 'compact-left') {
    return (
      <View style={styles.compactLeftContainer}>
        {back && onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={onBack}
            style={({ pressed }) => [styles.backButtonInline, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Icon name="arrow" color={Colors.brandDark} size={15} />
            <AppText style={styles.backText}>Volver</AppText>
          </Pressable>
        ) : null}

        <View style={styles.brandRowCompact}>
          <Image
            source={require('../../assets/images/yupay-logo.png')}
            style={styles.brandLogoSmall}
            resizeMode="contain"
            accessibilityLabel="Logo Yupay"
          />
        </View>
      </View>
    );
  }

  // default variant (OpenDayScreen, HomeScreen, etc.)
  return (
    <View style={[styles.header, tone === 'brand' && styles.headerOnBrand]}>
      {back && onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          style={({ pressed }) => [styles.backButtonAbsolute, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Icon name="arrow" color={Colors.brandDark} size={15} />
          <AppText style={styles.backText}>Volver</AppText>
        </Pressable>
      ) : null}

      <View style={styles.brandRow}>
        {tone === 'brand' ? (
          <View style={styles.brandLogoSlotOnBrand}>
            <Image
              source={require('../../assets/images/yupay-logo.png')}
              style={styles.brandLogoOnBrand}
              resizeMode="contain"
              accessibilityLabel="Logo Yupay"
            />
          </View>
        ) : (
          <Image
            source={require('../../assets/images/yupay-logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Logo Yupay"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  headerOnBrand: {
    marginBottom: Spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoSlotOnBrand: {
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  brandLogo: {
    width: 140,
    height: 46,
  },
  brandLogoOnBrand: {
    width: 110,
    height: 36,
  },
  backButtonAbsolute: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandSoft,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
    zIndex: 2,
  },
  // Compact left variant (para Nuevo Movimiento)
  compactLeftContainer: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 14,
    marginBottom: Spacing.xs,
  },
  backButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandSoft,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  brandRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoSmall: {
    width: 100,
    height: 33,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
});