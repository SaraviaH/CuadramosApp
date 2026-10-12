import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../theme';
import { Icon } from '../display/Icon';

interface Props {
  onPress: () => void;
}

const SIZE = 56;

export function FloatingActionButton({ onPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Registrar movimiento"
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        { bottom: 70 + insets.bottom + Spacing.md, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Icon name="plus" color={Colors.white} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.md,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brandDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
});