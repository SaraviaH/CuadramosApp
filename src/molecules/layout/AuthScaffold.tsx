import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
import { AppButton, AppText } from '../../atoms';
import { BackButton } from '../navigation/BackButton';
import { ScreenTitle } from '../display/ScreenTitle';
import { ScreenContainer } from './ScreenContainer';

interface Props {
  title: string;
  subtitle: string;
  onBack: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryLoading?: boolean;
  skipLabel: string;
  onSkip: () => void;
  switchPrompt: string;
  switchLinkLabel: string;
  onSwitch: () => void;
  hint?: string;
  children: React.ReactNode;
}

export function AuthScaffold({
  title,
  subtitle,
  onBack,
  primaryLabel,
  onPrimary,
  primaryLoading,
  skipLabel,
  onSkip,
  switchPrompt,
  switchLinkLabel,
  onSwitch,
  hint,
  children,
}: Props) {
  return (
    <ScreenContainer keyboardShouldPersistTaps="handled">
      {/* Barra superior con volver y badge */}
      <View style={styles.topBar}>
        <BackButton onPress={onBack} label="Volver a Más" style={styles.topBarButton} />
        <View style={styles.optionalBadge}>
          <AppText variant="caption" style={styles.optionalBadgeText}>Acceso opcional</AppText>
        </View>
      </View>

      {/* Hero del logo */}
      <View style={styles.brandHero}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Compartamos Banco"
        />
        <AppText variant="title" style={styles.brandTitle}>COMPARTAMOS</AppText>
        <AppText variant="subtitle" style={styles.brandSubtitle}>BANCO</AppText>
      </View>

      <ScreenTitle alignCenter title={title} subtitle={subtitle} />

      {/* Formulario */}
      <View style={styles.formCard}>
        {children}

        <AppButton
          label={primaryLabel}
          loading={primaryLoading}
          onPress={onPrimary}
          style={styles.submit}
        />

        <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skipButton}>
          <AppText variant="label" style={styles.skipButtonText}>{skipLabel}</AppText>
        </Pressable>

        <View style={styles.authSwitch}>
          <AppText variant="body" style={styles.authSwitchText}>{switchPrompt}</AppText>
          <Pressable onPress={onSwitch}>
            <AppText variant="label" style={styles.authLink}>{switchLinkLabel}</AppText>
          </Pressable>
        </View>

        {hint ? <AppText variant="caption" style={styles.hint}>{hint}</AppText> : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  topBarButton: {
    marginBottom: 0,
    alignSelf: 'center',
  },
  optionalBadge: {
    backgroundColor: Colors.neutralSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  optionalBadgeText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.muted,
  },
  brandHero: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  brandLogo: {
    width: 56,
    height: 56,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: Typography.micro.fontSize,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: Colors.brand,
  },
  brandSubtitle: {
    fontSize: Typography.micro.fontSize,
    letterSpacing: 2.2,
    fontWeight: '600',
    color: Colors.muted,
    marginTop: 2,
  },
  formCard: {
    ...Surfaces.card,
    padding: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  submit: {
    marginTop: Spacing.xs,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  skipButtonText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
  authSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authSwitchText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
  authLink: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.brand,
  },
  hint: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    textAlign: 'center',
  },
});
