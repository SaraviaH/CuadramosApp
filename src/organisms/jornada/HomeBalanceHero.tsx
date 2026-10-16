import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
  onAvatarPress?: () => void;
}

export function HomeBalanceHero({
  balance,
  greeting,
  dateTitle,
  isOpen = true,
  avatarUri,
  userName,
  onAvatarPress,
}: Props) {
  const currentBalance = balance?.saldoActual ?? 0;

  return (
    <View>
      <View style={styles.greetingRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
          onPress={onAvatarPress}
          hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        >
          <Avatar uri={avatarUri} name={userName} size={48} borderColor={Colors.white} />
        </Pressable>
        <View style={styles.greetingText}>
          <AppText numberOfLines={1} style={styles.greeting}>
            {greeting}
          </AppText>
          {userName?.trim() ? (
            <AppText numberOfLines={1} style={styles.userName}>
              {userName}
            </AppText>
          ) : null}
        </View>
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

      <AppText numberOfLines={1} style={styles.eyebrow}>Saldo en caja</AppText>
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
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.onColorStrong,
    letterSpacing: 0.2,
  },
  userName: {
    fontSize: Typography.heading.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
    marginTop: 2,
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
    letterSpacing: 0.5,
    fontWeight: '800',
    color: Colors.onColorStrong,
    marginTop: Spacing.md,
    textTransform: 'uppercase',
  },
  balanceText: {
    fontSize: Typography.display.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginTop: 4,
  },
});
