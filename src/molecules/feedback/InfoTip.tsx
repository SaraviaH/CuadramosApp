import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';
import { AppText, IconButton } from '../../atoms';
import { AnchoredPopover } from './AnchoredPopover';

interface Props {
  text: string;
  accessibilityLabel?: string;
}

/**
 * Ícono (i) que muestra un texto explicativo en un globo flotante.
 * Reemplaza a los subtítulos largos en los encabezados.
 */
export function InfoTip({ text, accessibilityLabel = 'Más información' }: Props) {
  return (
    <AnchoredPopover
      accessibilityLabel={accessibilityLabel}
      renderTrigger={open => <IconButton icon="info" tone="neutral" active={open} />}
    >
      {() => <AppText style={styles.text}>{text}</AppText>}
    </AnchoredPopover>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: Typography.caption.fontSize,
    lineHeight: 19,
    color: Colors.text,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
