import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';

interface Props<T extends string> {
  label: string;
  items: readonly T[];
  selected: T;
  onSelect: (item: T) => void;
  tone?: 'green' | 'red' | 'orange' | 'magenta';
}

const toneStyles = {
  green: { activeBg: Colors.greenLight, activeColor: Colors.success, activeBorder: Colors.successBorder },
  red: { activeBg: Colors.redLight, activeColor: Colors.danger, activeBorder: Colors.dangerBorder },
  orange: { activeBg: Colors.warningSoft, activeColor: Colors.warning, activeBorder: Colors.warningBorder },
  magenta: { activeBg: Colors.brandSoft, activeColor: Colors.brandDark, activeBorder: Colors.brandBorder },
};

export function ChipSelector<T extends string>({
  label,
  items,
  selected,
  onSelect,
  tone = 'magenta',
}: Props<T>) {
  const currentTone = toneStyles[tone];

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.chipsRow}>
        {items.map(item => {
          const isSelected = selected === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(item)}
              style={[
                styles.chip,
                isSelected && {
                  backgroundColor: currentTone.activeBg,
                  borderColor: currentTone.activeBorder,
                },
              ]}
            >
              <AppText
                style={[
                  styles.chipText,
                  isSelected && { color: currentTone.activeColor, fontWeight: '700' },
                ]}
              >
                {item}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.neutralSoft,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.muted,
  },
});
