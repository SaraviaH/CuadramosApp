import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Avatar } from '../../atoms';
import { formatAmount } from '../../utils';
import { Balance } from '../../types';

interface Props {
  balance: Balance | null;
  greeting: string;
  dateTitle: string;
  isOpen?: boolean;
  avatarUri?: string;
  userName?: string;
}

export function HomeBalanceHero({
  balance,
  greeting,
  dateTitle,
  isOpen = true,
  avatarUri,
  userName,
}: Props) {
  const currentBalance = balance?.saldoActual ?? 0;

  return (
    <View>
      <View style={styles.greetingRow}>
        <Avatar uri={avatarUri} name={userName} size={48} borderColor={Colors.white} />
        <AppText numberOfLines={1} style={styles.greeting}>
          {greeting}
        </AppText>
      </View>

      <View style={styles.dateRow}>
        <AppText numberOfLines={1} style={styles.date}>
          {dateTitle}
        </AppText>

        <View style={[styles.livePill, !isOpen && styles.livePillClosed]}>
          {isOpen ? <View style={styles.liveDot} /> : null}
          <AppText style={styles.livePillText}>
            {isOpen ? 'Caja abierta' : 'Caja cerrada'}
          </AppText>
        </View>
      </View>

      <AppText style={styles.eyebrow}>SALDO DISPONIBLE EN CAJA</AppText>
      <AppText numberOfLines={1} adjustsFontSizeToFit style={styles.balanceText}>
        {formatAmount(currentBalance)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greeting: {
    flex: 1,
    fontSize: Typography.heading.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: 6,
  },
  date: {
    flex: 1,
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.onColorStrong,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.onColorSurfaceFaint,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  livePillClosed: {
    backgroundColor: Colors.onColorSurface,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.successBright,
  },
  livePillText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.white,
  },
  eyebrow: {
    fontSize: Typography.micro.fontSize,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: Colors.onColorStrong,
    marginTop: Spacing.md,
  },
  balanceText: {
    fontSize: Typography.display.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginTop: 4,
  },
});
