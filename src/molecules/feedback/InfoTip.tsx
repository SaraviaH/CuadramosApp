import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
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
      renderTrigger={open => (
        <View style={styles.trigger}>
          <Icon name="info" color={open ? Colors.brand : Colors.text} size={18} />
        </View>
      )}
    >
      {() => <AppText style={styles.text}>{text}</AppText>}
    </AnchoredPopover>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: Typography.caption.fontSize,
    lineHeight: 19,
    color: Colors.text,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
