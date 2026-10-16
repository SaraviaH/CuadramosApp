import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';

interface Props {
  title: string;
  subtitle?: string;
  /** Accesorio opcional a la izquierda (p. ej. el botón Volver). */
  left?: React.ReactNode;
  /** Accesorio opcional a la derecha (p. ej. un dropdown o un (i)). */
  right?: React.ReactNode;
}

/**
 * Encabezado de pantalla uniforme: título y subtítulo centrados respecto al
 * ancho completo. Los accesorios `left` (Volver) y `right` quedan anclados en
 * los extremos mediante columnas simétricas, por lo que NO desplazan el centro.
 */
export function ScreenTitle({ title, subtitle, left, right }: Props) {
  return (
    <View style={[styles.container, styles.center]}>
      <View style={styles.titleRowCentered}>
        <View style={styles.side}>{left}</View>
        <AppText style={[styles.title, styles.centerText]}>{title}</AppText>
        <View style={[styles.side, styles.sideEnd]}>{right}</View>
      </View>
      {subtitle ? (
        <AppText style={[styles.subtitle, styles.centerText]}>{subtitle}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  center: {
    alignItems: 'center',
  },
  titleRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  side: {
    flex: 1,
    alignItems: 'flex-start',
  },
  sideEnd: {
    alignItems: 'flex-end',
  },
  centerText: {
    textAlign: 'center',
  },
  title: {
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.caption.fontSize,
    lineHeight: 19,
    color: Colors.text,
    marginTop: 5,
    maxWidth: 340,
  },
});
