import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Sizes, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { AnchoredPopover } from '../feedback/AnchoredPopover';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  /** Etiqueta accesible del control (lo que anuncia el lector de pantalla). */
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Resalta el control cuando tiene un valor distinto al por defecto. */
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Select compacto: muestra el valor actual y despliega la lista de opciones
 * en un globo anclado (reutiliza `AnchoredPopover`). Consistente con el
 * dropdown de `HeaderDropdown`, sin dependencias externas.
 */
export function Select({ label, value, options, onChange, isActive, style }: Props) {
  const current = options.find(option => option.value === value) ?? options[0];

  return (
    <AnchoredPopover
      accessibilityLabel={label}
      align="left"
      renderTrigger={open => (
        <View
          style={[
            styles.trigger,
            isActive && styles.triggerActive,
            open && styles.triggerOpen,
            style,
          ]}
        >
          <AppText
            numberOfLines={1}
            style={[styles.triggerText, isActive && styles.triggerTextActive]}
          >
            {current?.label ?? ''}
          </AppText>
          <Icon name="chevronDown" color={isActive ? Colors.brand : Colors.text} size={14} />
        </View>
      )}
    >
      {close => (
        <View style={styles.menu}>
          {options.map(option => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.05)' }}
                onPress={() => {
                  close();
                  onChange(option.value);
                }}
                style={({ pressed }) => [styles.option, { opacity: pressed ? 0.7 : 1 }]}
              >
                <AppText
                  numberOfLines={1}
                  style={[styles.optionLabel, selected && styles.optionLabelSelected]}
                >
                  {option.label}
                </AppText>
                {selected ? <Icon name="check" color={Colors.brand} size={15} /> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </AnchoredPopover>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    minHeight: Sizes.controlHeight,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  triggerActive: {
    backgroundColor: Colors.brandSoft,
    borderColor: Colors.brand,
  },
  triggerOpen: {
    borderColor: Colors.brand,
  },
  triggerText: {
    flexShrink: 1,
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
  triggerTextActive: {
    color: Colors.brandDark,
    fontWeight: '800',
  },
  menu: {
    minWidth: 190,
    gap: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
  },
  optionLabel: {
    flexShrink: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.brand,
    fontWeight: '800',
  },
});
