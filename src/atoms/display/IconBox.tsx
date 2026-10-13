import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../theme';
import { Icon, IconName } from './Icon';

export type IconBoxShape = 'square' | 'rounded' | 'card' | 'hero' | 'circle';

interface Props {
  name: IconName;
  color?: string;
  backgroundColor?: string;
  size?: number;
  iconSize?: number;
  shape?: IconBoxShape;
  style?: StyleProp<ViewStyle>;
}

const shapeStyles: Record<IconBoxShape, ViewStyle> = {
  square: { borderRadius: Radius.sm },
  rounded: { borderRadius: Radius.md },
  card: { ...Radius.asymmetricIcon },
  hero: { ...Radius.asymmetricHero },
  circle: { borderRadius: Radius.pill },
};

export function IconBox({
  name,
  color = Colors.brand,
  backgroundColor = Colors.brandSoft,
  size = 42,
  iconSize = 20,
  shape = 'square',
  style,
}: Props) {
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, backgroundColor },
        shapeStyles[shape],
        style,
      ]}
    >
      <Icon name={name} color={color} size={iconSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
