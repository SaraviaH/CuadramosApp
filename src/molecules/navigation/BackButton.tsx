import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';

interface Props {
  onPress: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function BackButton({ onPress, label = 'Volver', style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, { opacity: pressed ? 0.8 : 1 }]}
    >
      <Icon name="arrow" color={Colors.brandDark} size={15} />
      <AppText style={styles.text}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandSoft,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brandDark,
  },
});
