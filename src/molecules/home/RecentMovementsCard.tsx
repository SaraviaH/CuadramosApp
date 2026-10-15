import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { Movimiento } from '../../types';
import { MovementCard } from '../movements/MovementCard';
import { EmptyState } from '../feedback/EmptyState';

interface Props {
  movements: Movimiento[];
  onSeeAll?: () => void;
  max?: number;
}

export function RecentMovementsCard({ movements, onSeeAll, max = 3 }: Props) {
  const recent = [...movements].reverse().slice(0, max);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <AppText style={styles.title}>Últimos movimientos</AppText>

        {onSeeAll ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver todos los movimientos"
            onPress={onSeeAll}
            style={({ pressed }) => [styles.link, { opacity: pressed ? 0.7 : 1 }]}
          >
            <AppText style={styles.linkText}>Ver todos</AppText>
            <Icon name="chevron" color={Colors.brand} size={14} />
          </Pressable>
        ) : null}
      </View>

      {recent.length === 0 ? (
        <EmptyState
          icon="wallet"
          title="Aún no registras movimientos hoy"
          subtitle="Tus ingresos y gastos del día aparecerán aquí."
          variant="dashed"
        />
      ) : (
        <View style={styles.list}>
          {recent.map(movement => (
            <MovementCard key={movement.id} movement={movement} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: Colors.muted,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brand,
  },
  list: {
    gap: Spacing.xs,
  },
});
