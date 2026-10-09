import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from '../../atoms';

interface Props<T extends string> {
  label: string;
  items: readonly T[];
  selected: T;
  onSelect: (item: T) => void;
  tone?: 'green' | 'red' | 'orange' | 'magenta';
}

const toneStyles = {
  green: { activeBg: Colors.greenLight, activeColor: '#0D704D', activeBorder: '#A9DFC9' },
  red: { activeBg: Colors.redLight, activeColor: '#A82D2D', activeBorder: '#F1C1C1' },
  orange: { activeBg: '#FFF6DF', activeColor: '#805510', activeBorder: '#EDDAAA' },
  magenta: { activeBg: Colors.brandSoft, activeColor: Colors.brandDark, activeBorder: '#F1CADB' },
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
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#454549',
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
    backgroundColor: '#F3F3F5',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.muted,
  },
});
