import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon } from '../../atoms';

interface Props {
  back?: boolean;
  onBack?: () => void;
  variant?: 'default' | 'compact-left' | 'moderate';
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
            source={require('../../assets/images/logo.png')}
            style={styles.brandLogoSmall}
            resizeMode="contain"
            accessibilityLabel="Logo Compartamos Banco"
          />
          <View style={styles.brandCopyCompact}>
            <AppText style={styles.brandTitleSmall}>COMPARTAMOS</AppText>
            <AppText style={styles.brandSubtitleSmall}>BANCO</AppText>
          </View>
        </View>
      </View>
    );
  }

  if (variant === 'moderate') {
    return (
      <View style={styles.moderateContainer}>
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

        <View style={styles.brandRowModerate}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.brandLogoModerate}
            resizeMode="contain"
            accessibilityLabel="Logo Compartamos Banco"
          />
          <View style={styles.brandCopyModerate}>
            <AppText style={styles.brandTitleModerate}>COMPARTAMOS</AppText>
            <AppText style={styles.brandSubtitleModerate}>BANCO</AppText>
          </View>
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
        <Image
          source={require('../../assets/images/logo.png')}
          style={[styles.brandLogo, tone === 'brand' && styles.brandLogoOnBrand]}
          resizeMode="contain"
          accessibilityLabel="Logo Compartamos Banco"
        />
        <View style={styles.brandCopy}>
          <AppText style={[styles.brandTitle, tone === 'brand' && styles.brandTitleOnBrand]}>
            COMPARTAMOS
          </AppText>
          <AppText style={[styles.brandSubtitle, tone === 'brand' && styles.brandSubtitleOnBrand]}>
            BANCO
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 58,
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
    gap: 12,
  },
  brandLogo: {
    width: 52,
    height: 52,
  },
  brandLogoOnBrand: {
    tintColor: Colors.white,
  },
  brandCopy: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    letterSpacing: 1.3,
    fontWeight: '900',
    color: Colors.brand,
    lineHeight: 23,
  },
  brandTitleOnBrand: {
    color: Colors.white,
  },
  brandSubtitle: {
    fontSize: 13,
    letterSpacing: 3.2,
    fontWeight: '800',
    color: Colors.muted,
    marginTop: 2,
  },
  brandSubtitleOnBrand: {
    color: Colors.onColor,
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
    gap: 8,
  },
  brandLogoSmall: {
    width: 34,
    height: 34,
  },
  brandCopyCompact: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitleSmall: {
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: '900',
    color: Colors.brand,
    lineHeight: 17,
  },
  brandSubtitleSmall: {
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '800',
    color: Colors.muted,
    marginTop: 1,
  },
  // Moderate variant (para Resumen Financiero)
  moderateContainer: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    position: 'relative',
  },
  brandRowModerate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  brandLogoModerate: {
    width: 38,
    height: 38,
  },
  brandCopyModerate: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitleModerate: {
    fontSize: 16,
    letterSpacing: 1.1,
    fontWeight: '900',
    color: Colors.brand,
    lineHeight: 18,
  },
  brandSubtitleModerate: {
    fontSize: 10,
    letterSpacing: 2.4,
    fontWeight: '800',
    color: Colors.muted,
    marginTop: 1,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
});