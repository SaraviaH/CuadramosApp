import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
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
  divider?: boolean;
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
  divider = false,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        divider && styles.divider,
        style,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <IconBox
        name={icon}
        color={iconColor}
        backgroundColor={iconBackgroundColor}
        size={38}
        iconSize={18}
        shape="square"
      />
      <View style={styles.copy}>
        <AppText style={[styles.title, { color: titleColor, fontWeight: titleWeight }]}>
          {title}
        </AppText>
        {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      </View>
      {showChevron ? <Icon name="chevron" color={chevronColor} size={16} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.md,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
