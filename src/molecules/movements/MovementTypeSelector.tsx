import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon, IconName } from '../../atoms';
import { TipoMovimiento } from '../../types';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

interface Props {
  value: TipoMovimiento;
  onChange: (type: TipoMovimiento) => void;
}

const options: { value: TipoMovimiento; label: string; icon: IconName; activeColor: string }[] = [
  { value: 'INGRESO', label: 'Ingreso', icon: 'arrowDown', activeColor: Colors.success },
  { value: 'EGRESO', label: 'Egreso', icon: 'arrowUp', activeColor: Colors.danger },
  { value: 'RETIRO', label: 'Retiro', icon: 'logout', activeColor: Colors.warning },
];

export function MovementTypeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map(option => {
        const isActive = value === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.option,
              isActive && { backgroundColor: option.activeColor, ...Shadows.sm },
              pressed && !isActive ? styles.pressedOption : undefined,
            ]}
          >
            <View style={styles.optionContent}>
              <Icon
                name={option.icon}
                color={isActive ? Colors.white : Colors.textMuted}
                size={16}
              />
              <AppText
                variant="label"
                color={isActive ? Colors.white : Colors.textMuted}
                style={styles.label}
              >
                {option.label}
              </AppText>
            </View>
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
    padding: Spacing.xxs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  option: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pressedOption: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  label: {
    letterSpacing: 0.2,
  },
});

