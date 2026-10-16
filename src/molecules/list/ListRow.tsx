import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, Icon, IconBox, IconName } from '../../atoms';

interface Props {
  icon: IconName;
  iconColor?: string;
  iconBackgroundColor?: string;
  title: string;
  subtitle?: string;
  titleColor?: string;
  titleWeight?: '600' | '700' | '800';
  onPress?: () => void;
  showChevron?: boolean;
  chevronColor?: string;
  /** Fila sin acción: se atenúa y oculta el chevron. */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ListRow({
  icon,
  iconColor = Colors.text,
  iconBackgroundColor = Colors.neutralSoft,
  title,
  subtitle,
  titleColor = Colors.text,
  titleWeight = '700',
  onPress,
  showChevron = true,
  chevronColor = Colors.text,
  disabled = false,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        style,
        {
          opacity: disabled ? 0.55 : pressed ? 0.86 : 1,
          transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
        },
      ]}
    >
      <IconBox
        name={icon}
        color={iconColor}
        backgroundColor={iconBackgroundColor}
        size={38}
        iconSize={18}
        shape="card"
      />
      <View style={styles.copy}>
        <AppText style={[styles.title, { color: titleColor, fontWeight: titleWeight }]}>
          {title}
        </AppText>
        {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      </View>
      {showChevron && !disabled ? (
        <Icon name="chevron" color={chevronColor} size={16} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    ...Surfaces.card,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: Typography.caption.fontSize,
  },
  subtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    marginTop: 2,
  },
});
