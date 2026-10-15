import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppText, Icon, IconName } from '../../atoms';

interface Props {
  /** Texto de la sección (a la izquierda). */
  title: string;
  /** Icono opcional que precede al título. */
  icon?: IconName;
  /** Enlace de la derecha (p. ej. "Ver todos ›"). */
  actionLabel?: string;
  /** Etiqueta accesible del enlace; por defecto usa `actionLabel`. */
  actionAccessibilityLabel?: string;
  /** Acción del enlace. Si falta, el enlace no se muestra. */
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Cabecera de sección de Inicio: título (con icono opcional) a la izquierda y
 * un enlace a la derecha. Va FUERA de la tarjeta, con estilo unificado.
 */
export function SectionHeader({
  title,
  icon,
  actionLabel,
  actionAccessibilityLabel,
  onAction,
  style,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        {icon ? <Icon name={icon} color={Colors.text} size={14} /> : null}
        <AppText numberOfLines={1} style={styles.label}>
          {title}
        </AppText>
      </View>

      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
          onPress={onAction}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppText style={styles.action}>{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  label: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.text,
  },
  action: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brand,
  },
});
