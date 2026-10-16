import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppText } from '../display/AppText';

/**
 * Solo dígitos, un separador decimal (coma o punto) y máximo 2 decimales.
 * Sirve a montos en soles de apertura de caja y de movimientos.
 */
export const sanitizeAmountInput = (raw: string): string => {
  const digitsAndSep = raw.replace(/[^0-9.,]/g, '');

  const firstSepIndex = digitsAndSep.search(/[.,]/);
  const noRepeatedSep =
    firstSepIndex === -1
      ? digitsAndSep
      : digitsAndSep.slice(0, firstSepIndex + 1) +
        digitsAndSep.slice(firstSepIndex + 1).replace(/[.,]/g, '');

  const match = noRepeatedSep.match(/^([0-9]*[.,]?[0-9]{0,2})/);
  return match ? match[1] : noRepeatedSep;
};

interface Props {
  /** Etiqueta opcional sobre el campo (no usar si el encabezado ya la dice). */
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  accessibilityLabel: string;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Campo de monto grande: prefijo "S/" y número en 24px bold dentro de un
 * recuadro de 68px (mismo aspecto en Apertura de caja y Nuevo movimiento).
 */
export function AmountField({
  label,
  value,
  onChangeText,
  error,
  accessibilityLabel,
  autoFocus,
  style,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="captionBold" color={focused ? Colors.brand : Colors.text}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          error ? styles.fieldError : undefined,
          style,
        ]}
      >
        <AppText style={styles.prefix}>S/</AppText>
        <TextInput
          accessibilityLabel={accessibilityLabel}
          value={value}
          onChangeText={text => onChangeText(sanitizeAmountInput(text))}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectTextOnFocus
          returnKeyType="done"
          autoFocus={autoFocus}
          maxLength={12}
        />
      </View>

      {error ? (
        <AppText variant="captionBold" color={Colors.danger} style={styles.feedback}>
          {`• ${error}`}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  field: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.brandSoft,
    borderWidth: 2,
    borderColor: Colors.brandBorder,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
  },
  fieldFocused: {
    borderColor: Colors.brand,
    backgroundColor: Colors.surface,
  },
  fieldError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSoft,
  },
  prefix: {
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.brand,
  },
  input: {
    flex: 1,
    padding: 0,
    minHeight: 44,
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  feedback: {
    marginTop: 2,
    paddingHorizontal: Spacing.xxs,
  },
});
