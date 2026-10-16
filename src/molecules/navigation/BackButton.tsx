import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IconButton } from '../../atoms';

interface Props {
  onPress: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Botón de volver. Muestra solo la flecha (←) en un círculo gris, igual que
 * los accesos de Inicio. `label` se usa como etiqueta accesible.
 */
export function BackButton({ onPress, label = 'Volver', style }: Props) {
  return (
    <IconButton
      icon="arrow"
      accessibilityLabel={label}
      onPress={onPress}
      style={style}
    />
  );
}
