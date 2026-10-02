import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Colors, Radius, Sizes, Spacing } from '../../theme';
import { AppText } from '../display/AppText';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  prefix?: string;
}

export function AppInput({
  label,
  error,
  hint,
  prefix,
  style,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <AppText variant="label" color={isFocused ? Colors.brand : Colors.text}>
        {label}
      </AppText>
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.inputFocused : undefined,
          error ? styles.inputError : undefined,
        ]}
      >
        {prefix ? (
          <AppText variant="subheading" color={Colors.textMuted} style={styles.prefix}>
            {prefix}
          </AppText>
        ) : null}
        <TextInput
          placeholderTextColor={Colors.textMuted}
          accessibilityLabel={label}
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
          {...props}
        />
      </View>

      {error ? (
        <AppText variant="captionBold" color={Colors.danger} style={styles.feedback}>
          {`• ${error}`}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={Colors.textMuted} style={styles.feedback}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  inputContainer: {
    minHeight: Sizes.inputHeight,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: Colors.borderFocus,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSoft,
  },
  prefix: {
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: 16,
    paddingVertical: Spacing.xs,
  },
  feedback: {
    marginTop: 2,
    paddingHorizontal: Spacing.xxs,
  },
});

