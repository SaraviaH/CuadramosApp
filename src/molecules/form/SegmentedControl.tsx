import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';

interface Props<T extends string> {
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
  tone?: 'green' | 'red' | 'orange' | 'magenta';
  labels?: readonly string[];
  size?: 'md' | 'lg';
}

const toneBackgrounds = {
  green: Colors.green,
  red: Colors.red,
  orange: Colors.orange,
  magenta: Colors.brand,
};

export function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
  tone = 'magenta',
  labels,
  size = 'md',
}: Props<T>) {
  const isLarge = size === 'lg';

  return (
    <View style={styles.container}>
      {options.map((item, index) => {
        const isActive = selected === item;
        const text = labels?.[index] ?? item;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={text}
            onPress={() => onSelect(item)}
            style={[
              styles.button,
              isLarge && styles.buttonLarge,
              isActive && { backgroundColor: toneBackgrounds[tone], shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 2 },
            ]}
          >
            <AppText style={[styles.label, isLarge && styles.labelLarge, isActive && styles.activeLabel]}>
              {text}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.neutralSoft,
    borderRadius: Radius.md,
    padding: Spacing.xxs,
    gap: Spacing.xxs,
  },
  button: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  buttonLarge: {
    minHeight: 46,
  },
  label: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.muted,
  },
  labelLarge: {
    fontSize: Typography.label.fontSize,
  },
  activeLabel: {
    color: Colors.white,
    fontWeight: '800',
  },
});
