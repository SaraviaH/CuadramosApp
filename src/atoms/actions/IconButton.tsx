import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../theme';
import { Icon, IconName } from '../display/Icon';

interface Props {
  icon: IconName;
  accessibilityLabel?: string;
  onPress?: () => void;
  /**
   * `neutral` = círculo gris suave con ícono oscuro (pantallas claras).
   * `onBrand` = círculo blanco translúcido con ícono blanco (sobre fondos de color).
   */
  tone?: 'neutral' | 'onBrand';
  /** Estado abierto/activo: colorea el ícono con el magenta de marca. */
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Botón circular de ícono (40×40). Consistente con los accesos de Inicio.
 * Si no recibe `onPress` se renderiza como vista (para usarse como disparador
 * dentro de otro `Pressable`, p. ej. `AnchoredPopover`).
 */
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  tone = 'neutral',
  active = false,
  style,
}: Props) {
  const iconColor = tone === 'onBrand' ? Colors.white : active ? Colors.brand : Colors.text;
  const base = [styles.base, tone === 'onBrand' ? styles.onBrand : styles.neutral, style];
  const content = <Icon name={icon} color={iconColor} size={20} />;

  if (!onPress) {
    return <View style={base}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [base, { opacity: pressed ? 0.8 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neutral: {
    backgroundColor: Colors.neutralSoft,
  },
  onBrand: {
    backgroundColor: Colors.onColorSurface,
  },
});
