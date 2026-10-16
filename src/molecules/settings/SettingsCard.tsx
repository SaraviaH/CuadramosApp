import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Card, Icon, IconName } from '../../atoms';

interface Props {
  /** Icono del bloque (a la izquierda). Alternativo a `iconText`. */
  icon?: IconName;
  /** Texto corto en lugar de icono (p. ej. "Aa"). Tiene prioridad si se define. */
  iconText?: string;
  /** Color del icono/texto del bloque. */
  iconColor?: string;
  /** Fondo del bloque de icono. */
  iconBackgroundColor?: string;
  title: string;
  description?: string;
  /** Accesorio a la derecha del título (p. ej. un Switch). */
  right?: React.ReactNode;
  /** Contenido bajo el encabezado (controles, filas de estado…). */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tarjeta de ajuste con encabezado uniforme: bloque de icono + título y
 * descripción, con un accesorio opcional a la derecha y contenido debajo.
 */
export function SettingsCard({
  icon,
  iconText,
  iconColor = Colors.brand,
  iconBackgroundColor = Colors.brandSoft,
  title,
  description,
  right,
  children,
  style,
}: Props) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={[styles.leading, { backgroundColor: iconBackgroundColor }]}>
          {iconText ? (
            <AppText variant="subheading" color={iconColor}>
              {iconText}
            </AppText>
          ) : icon ? (
            <Icon name={icon} color={iconColor} size={20} />
          ) : null}
        </View>

        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <AppText variant="captionBold" color={Colors.text}>
              {title}
            </AppText>
            {right}
          </View>
          {description ? (
            <AppText style={styles.description} color={Colors.text}>
              {description}
            </AppText>
          ) : null}
        </View>
      </View>

      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  leading: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  description: {
    fontSize: Typography.micro.fontSize,
    lineHeight: Typography.micro.lineHeight,
  },
});
