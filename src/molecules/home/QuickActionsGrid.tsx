import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../theme';
import { AppButton, ButtonVariant } from '../../atoms';
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
  variant: ButtonVariant;
  /** Color del icono cuando difiere del color del texto (Gasto: mango). */
  iconColor?: string;
}

const ACTIONS: QuickAction[] = [
  {
    tipo: 'INGRESO',
    label: 'Ingreso',
    accessibilityLabel: 'Registrar ingreso',
    variant: 'surfaceBrand',
  },
  {
    tipo: 'EGRESO',
    label: 'Gasto',
    accessibilityLabel: 'Registrar gasto',
    variant: 'surfaceAccent',
    iconColor: Colors.accent,
  },
];

export function QuickActionsGrid({ onSelect, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {ACTIONS.map(action => (
        <AppButton
          key={action.tipo}
          variant={action.variant}
          iconName={getTipoVisual(action.tipo).icon}
          iconColor={action.iconColor}
          label={action.label}
          accessibilityLabel={action.accessibilityLabel}
          onPress={() => onSelect?.(action.tipo)}
          style={styles.button}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  button: {
    flex: 1,
  },
});
