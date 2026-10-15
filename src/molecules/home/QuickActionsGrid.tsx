import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, Icon, IconBox } from '../../atoms';
import { TipoMovimiento } from '../../types';
import { getTipoVisual } from '../movements/movementVisuals';

interface Props {
  onSelect?: (tipo: TipoMovimiento) => void;
  style?: StyleProp<ViewStyle>;
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

export function QuickActionsGrid({ onSelect, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
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
  grid: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  card: {
    ...Surfaces.card,
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  cardLabel: {
    flex: 1,
    fontSize: Typography.micro.fontSize,
    lineHeight: Typography.micro.lineHeight,
    fontWeight: '700',
    color: Colors.text,
  },
});
