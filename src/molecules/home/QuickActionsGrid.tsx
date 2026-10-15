import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing } from '../../theme';
import { AppButton, ButtonTone, ButtonVariant } from '../../atoms';
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
  /** Botón sólido magenta (ingreso) o mango (gasto). */
  tone?: ButtonTone;
  variant?: ButtonVariant;
}

const ACTIONS: QuickAction[] = [
  {
    tipo: 'INGRESO',
    label: 'Ingreso',
    accessibilityLabel: 'Registrar ingreso',
    tone: 'magenta',
  },
  {
    tipo: 'EGRESO',
    label: 'Gasto',
    accessibilityLabel: 'Registrar gasto',
    variant: 'accent',
  },
];

export function QuickActionsGrid({ onSelect, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {ACTIONS.map(action => (
        <AppButton
          key={action.tipo}
          tone={action.tone}
          variant={action.variant}
          iconName={getTipoVisual(action.tipo).icon}
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
