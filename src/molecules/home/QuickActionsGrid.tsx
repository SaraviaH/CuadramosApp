import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText, Icon, IconBox } from '../../atoms';
import { TipoMovimiento } from '../../types';
import { getTipoVisual } from '../movements/movementVisuals';

interface Props {
  onSelect?: (tipo: TipoMovimiento) => void;
}

interface QuickAction {
  tipo: TipoMovimiento;
  label: string;
  accessibilityLabel: string;
}

const ACTIONS: QuickAction[] = [
  {
    tipo: 'INGRESO',
    label: 'Registrar\ningreso',
    accessibilityLabel: 'Registrar ingreso',
  },
  {
    tipo: 'EGRESO',
    label: 'Registrar\ngasto',
    accessibilityLabel: 'Registrar gasto',
  },
];

export function QuickActionsGrid({ onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText style={styles.title}>Acciones rápidas</AppText>

      <View style={styles.grid}>
        {ACTIONS.map(action => {
          const visual = getTipoVisual(action.tipo);
          return (
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
                name={visual.icon}
                color={visual.color}
                backgroundColor={visual.background}
                size={42}
                iconSize={22}
                shape="card"
              />
              <AppText numberOfLines={2} style={styles.cardLabel}>
                {action.label}
              </AppText>
              <Icon name="chevron" color={Colors.text} size={16} />
            </Pressable>
          );
        })}
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
