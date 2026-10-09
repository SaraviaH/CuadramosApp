import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Sizes } from '../../theme';

export type IconName =
  | 'home'
  | 'list'
  | 'chart'
  | 'more'
  | 'plus'
  | 'wallet'
  | 'check'
  | 'bulb'
  | 'calendar'
  | 'tag'
  | 'note'
  | 'arrow'
  | 'settings'
  | 'help'
  | 'info'
  | 'logout'
  | 'store'
  | 'package'
  | 'bus'
  | 'sparkle'
  | 'clock'
  | 'chevron'
  | 'payments'
  | 'eye'
  | 'mail'
  | 'lock'
  | 'user';

const iconGlyphs: Record<IconName, string> = {
  home: '⌂',
  list: '☰',
  chart: '◰',
  more: '•••',
  plus: '+',
  wallet: '👛',
  check: '✓',
  bulb: '💡',
  calendar: '📅',
  tag: '🏷',
  note: '📝',
  arrow: '‹',
  settings: '⚙',
  help: '?',
  info: 'ℹ',
  logout: '↳',
  store: '🏪',
  package: '📦',
  bus: '🚌',
  sparkle: '✦',
  clock: '⏱',
  chevron: '›',
  payments: '💳',
  eye: '👁',
  mail: '✉',
  lock: '🔒',
  user: '👤',
};

interface Props {
  name?: IconName;
  symbol?: string;
  color?: string;
  size?: number;
}

export function Icon({ name, symbol, color = Colors.brand, size = Sizes.icon }: Props) {
  const displayGlyph = (name ? iconGlyphs[name] : null) ?? symbol ?? '•';
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.glyph, { color, fontSize: size * 0.9, lineHeight: size }]}>
        {displayGlyph}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    textAlign: 'center',
    fontWeight: '700',
  },
});
