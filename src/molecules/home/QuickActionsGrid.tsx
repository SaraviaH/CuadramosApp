import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../theme';
import { AppButton, ButtonVariant } from '../../atoms';
import { TipoMovimiento } from '../../types';
import { getTipoVisual } from '../movements/movementVisuals';

interface Props {
  onSelect?: (tipo: TipoMovimiento) => void;
  /** Acción de cierre de jornada: si se pasa, aparece el tercer botón. */
  onCloseDay?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface QuickAction {
  tipo: TipoMovimiento;
  label: string;
  accessibilityLabel: string;
  variant: ButtonVariant;
  iconColor?: string;
}

const ACTIONS: QuickAction[] = [
  {
    tipo: 'INGRESO',
    label: 'Ingreso',
    accessibilityLabel: 'Registrar ingreso',
    variant: 'neutral',
    iconColor: Colors.green,
  },
  {
    tipo: 'EGRESO',
    label: 'Gasto',
    accessibilityLabel: 'Registrar gasto',
    variant: 'primary',
  },
];

export function QuickActionsGrid({ onSelect, onCloseDay, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {ACTIONS.map(action => (
        <AppButton
          key={action.tipo}
          stacked
          variant={action.variant}
          iconName={getTipoVisual(action.tipo).icon}
          iconColor={action.iconColor}
          label={action.label}
          accessibilityLabel={action.accessibilityLabel}
          onPress={() => onSelect?.(action.tipo)}
          style={styles.button}
        />
      ))}

      {onCloseDay ? (
        <AppButton
          stacked
          variant="accent"
          iconName="lock"
          label="Cerrar"
          accessibilityLabel="Cerrar jornada"
          onPress={onCloseDay}
          style={styles.button}
        />
      ) : null}
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
