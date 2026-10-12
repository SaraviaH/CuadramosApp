import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { BrandHeader, ScreenContainer } from '../../molecules';
import { HomeBalanceHero } from '../../organisms';
import { useAuth, useJornada } from '../../hooks';

export function HomeScreen() {
  const { balance, movimientos } = useJornada();
  const { user } = useAuth();

  const greeting = user.isLoggedIn && user.name ? `Hola, ${user.name}` : 'Hola';

  return (
    <ScreenContainer>
      <BrandHeader />

      {/* Saludo y Fecha */}
      <View style={styles.greetingWrap}>
        <View style={styles.greetingPill}>
          <AppText style={styles.greetingText}>{greeting}</AppText>
        </View>
        <AppText style={styles.dateTitle}>Martes, 28 de enero</AppText>
      </View>

      {/* Saldo disponible en caja */}
      <HomeBalanceHero balance={balance} />

      {/* Estado actual de la caja */}
      <View style={styles.statusPill}>
        <View style={styles.statusPillLeft}>
          <Icon name="check" color={Colors.green} size={16} />
          <AppText style={styles.statusPillText}>Caja al día</AppText>
        </View>
        <AppText style={styles.statusPillCount}>{movimientos.length} movimientos hoy</AppText>
      </View>

      {/* Insight breve de valor */}
      <View style={styles.insightCard}>
        <View style={styles.insightIcon}>
          <Icon name="chart" color={Colors.green} size={20} />
        </View>
        <View style={styles.insightCopy}>
          <AppText style={styles.insightEyebrow}>BUENA SEÑAL</AppText>
          <AppText style={styles.insightTitle}>Ingresos +15% vs. semana anterior</AppText>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greetingWrap: {
    marginBottom: Spacing.md,
    gap: 4,
  },
  greetingPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...Radius.asymmetricChip,
  },
  greetingText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  dateTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statusPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginVertical: Spacing.sm,
  },
  statusPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPillText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.success,
  },
  statusPillCount: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.success,
    opacity: 0.85,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.greenLight,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  insightCopy: {
    flex: 1,
  },
  insightEyebrow: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 0.8,
  },
  insightTitle: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
});
