import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon, IconButton, IconName } from '../../atoms';
import { AnchoredPopover } from '../feedback/AnchoredPopover';

export interface HeaderDropdownItem {
  key: string;
  label: string;
  icon?: IconName;
  onPress: () => void;
}

interface Props {
  items: HeaderDropdownItem[];
  accessibilityLabel?: string;
}

/**
 * Botón de 3 puntos (⋮) que despliega un globo con opciones.
 * Pensado para ir al lado derecho de un `ScreenTitle`.
 */
export function HeaderDropdown({ items, accessibilityLabel = 'Más opciones' }: Props) {
  return (
    <AnchoredPopover
      accessibilityLabel={accessibilityLabel}
      renderTrigger={open => <IconButton icon="moreVertical" tone="neutral" active={open} />}
    >
      {close => (
        <View style={styles.menu}>
          {items.map(item => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              android_ripple={{ color: 'rgba(0, 0, 0, 0.05)' }}
              onPress={() => {
                close();
                item.onPress();
              }}
              style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}
            >
              <AppText style={styles.itemLabel}>{item.label}</AppText>
              <Icon name={item.icon ?? 'chevron'} color={Colors.brand} size={14} />
            </Pressable>
          ))}
        </View>
      )}
    </AnchoredPopover>
  );
}

const styles = StyleSheet.create({
  menu: {
    minWidth: 210,
    gap: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  itemLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
});
