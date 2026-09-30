import React from 'react';
import { Text } from 'react-native';
import { Colors, Sizes } from '../../theme';
interface Props { symbol: string; color?: string; size?: number; }
export function Icon({ symbol, color = Colors.brand, size = Sizes.icon }: Props) { return <Text style={{ color, fontSize: size }}>{symbol}</Text>; }
