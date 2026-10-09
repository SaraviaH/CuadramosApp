import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from '../../atoms';

interface Props<T extends string> {
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
  tone?: 'green' | 'red' | 'orange' | 'magenta';
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
}: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map(item => {
        const isActive = selected === item;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onSelect(item)}
            style={[
              styles.button,
              isActive && { backgroundColor: toneBackgrounds[tone], shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 2 },
            ]}
          >
            <AppText style={[styles.label, isActive && styles.activeLabel]}>
              {item}
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
    backgroundColor: '#F1F1F3',
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  button: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.muted,
  },
  activeLabel: {
    color: Colors.white,
    fontWeight: '800',
  },
});
