import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText, Icon, IconBox, IconName } from '../../atoms';
import { TipoMovimiento } from '../../types';

interface Props {
  onSelect?: (tipo: TipoMovimiento) => void;
}

interface QuickAction {
  tipo: TipoMovimiento;
  label: string;
  accessibilityLabel: string;
  icon: IconName;
  color: string;
  backgroundColor: string;
}

const ACTIONS: QuickAction[] = [
  {
    tipo: 'INGRESO',
    label: 'Registrar\ningreso',
    accessibilityLabel: 'Registrar ingreso',
    icon: 'plus',
    color: Colors.green,
    backgroundColor: Colors.greenLight,
  },
  {
    tipo: 'EGRESO',
    label: 'Registrar\ngasto',
    accessibilityLabel: 'Registrar gasto',
    icon: 'arrowDown',
    color: Colors.red,
    backgroundColor: Colors.redLight,
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
            accessibilityLabel={action.accessibilityLabel}
            accessibilityHint={`Abre el formulario para ${action.accessibilityLabel.toLowerCase()}`}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.06)' }}
            onPress={() => onSelect?.(action.tipo)}
            style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
          >
            <IconBox
              name={action.icon}
              color={action.color}
              backgroundColor={action.backgroundColor}
              size={42}
              iconSize={22}
              shape="card"
            />
            <AppText numberOfLines={2} style={styles.cardLabel}>
              {action.label}
            </AppText>
            <Icon name="chevron" color={Colors.text} size={16} />
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
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  card: {
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    ...Shadows.card,
  },
  cardLabel: {
    flex: 1,
    fontSize: Typography.micro.fontSize,
    lineHeight: Typography.micro.lineHeight,
    fontWeight: '700',
    color: Colors.text,
  },
});
