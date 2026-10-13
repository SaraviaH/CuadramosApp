import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText, IconBox, IconName } from '../../atoms';
import { TipoMovimiento } from '../../types';

interface Props {
  onSelect?: (tipo: TipoMovimiento) => void;
}

interface QuickAction {
  tipo: TipoMovimiento;
  label: string;
  icon: IconName;
  color: string;
  backgroundColor: string;
}

const ACTIONS: QuickAction[] = [
  {
    tipo: 'INGRESO',
    label: 'Venta',
    icon: 'plus',
    color: Colors.green,
    backgroundColor: Colors.greenLight,
  },
  {
    tipo: 'EGRESO',
    label: 'Gasto',
    icon: 'arrowDown',
    color: Colors.red,
    backgroundColor: Colors.redLight,
  },
  {
    tipo: 'RETIRO',
    label: 'Retiro',
    icon: 'wallet',
    color: Colors.orange,
    backgroundColor: Colors.warningSoft,
  },
];

export function QuickActionsGrid({ onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText style={styles.title}>Acciones rápidas</AppText>

      <View style={styles.grid}>
        {ACTIONS.map(action => (
          <Pressable
            key={action.tipo}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={() => onSelect?.(action.tipo)}
            style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
          >
            <IconBox
              name={action.icon}
              color={action.color}
              backgroundColor={action.backgroundColor}
              size={44}
              iconSize={22}
              shape="card"
            />
            <AppText style={styles.cardLabel}>{action.label}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xxs,
    ...Shadows.card,
  },
  cardLabel: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
});
