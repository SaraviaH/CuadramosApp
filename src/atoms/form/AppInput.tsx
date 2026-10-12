import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Colors, Sizes, Spacing, Typography } from '../../theme';
import { AppText } from '../display/AppText';
import { Icon, IconName } from '../display/Icon';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  prefix?: string;
  icon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
}

export function AppInput({
  label,
  error,
  hint,
  prefix,
  icon,
  rightIcon,
  onRightIconPress,
  style,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <AppText variant="captionBold" color={isFocused ? Colors.brand : Colors.text}>
        {label}
      </AppText>
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.inputFocused : undefined,
          error ? styles.inputError : undefined,
        ]}
      >
        {icon ? (
          <View style={styles.iconWrap}>
            <Icon name={icon} color={isFocused ? Colors.brand : Colors.muted} size={18} />
          </View>
        ) : null}

        {prefix ? (
          <AppText variant="subheading" color={Colors.text} style={styles.prefix}>
            {prefix}
          </AppText>
        ) : null}

        <TextInput
          placeholderTextColor={Colors.muted}
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

        {rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={8} style={styles.rightIconWrap}>
            <Icon name={rightIcon} color={Colors.muted} size={18} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="captionBold" color={Colors.red} style={styles.feedback}>
          {`• ${error}`}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={Colors.muted} style={styles.feedback}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  inputContainer: {
    minHeight: Sizes.inputHeight,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: Colors.brand,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.red,
    backgroundColor: Colors.redLight,
  },
  iconWrap: {
    marginRight: 8,
  },
  prefix: {
    marginRight: 6,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: Typography.body.fontSize,
    paddingVertical: Spacing.xs,
  },
  rightIconWrap: {
    marginLeft: 8,
    padding: 2,
  },
  feedback: {
    marginTop: 2,
    paddingHorizontal: Spacing.xxs,
  },
});
