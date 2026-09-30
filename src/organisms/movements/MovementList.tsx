import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '../../atoms';
import { MovementItem } from '../../molecules';
import { Movimiento } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';

interface Props {
  movements: Movimiento[];
  emptyTitle?: string;
  emptyMessage?: string;
}

export function MovementList({
  movements,
  emptyTitle = 'Sin movimientos registrados',
  emptyMessage = 'Aún no has registrado ingresos, egresos ni retiros en esta jornada.',
}: Props) {
  if (!movements.length) {
    return (
      <Card style={styles.emptyCard}>
        <View style={styles.emptyIconBox}>
          <AppText variant="heading" color={Colors.brand}>
            📋
          </AppText>
        </View>
        <AppText variant="heading" color={Colors.text} align="center">
          {emptyTitle}
        </AppText>
        <AppText variant="body" color={Colors.textMuted} align="center" style={styles.emptySubtitle}>
          {emptyMessage}
        </AppText>
      </Card>
    );
  }

  return (
    <View style={styles.list}>
      {movements.map(item => (
        <MovementItem key={item.id} movement={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    maxWidth: 280,
    marginTop: 2,
  },
});

