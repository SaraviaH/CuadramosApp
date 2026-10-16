import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  House,
  List,
  ChartNoAxesCombined,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Wallet,
  Check,
  Lightbulb,
  CalendarDays,
  Tag,
  FileText,
  ArrowLeft,
  Settings,
  CircleHelp,
  Info,
  LogOut,
  Store,
  Package,
  Truck,
  Sparkles,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CreditCard,
  Eye,
  Mail,
  Lock,
  UserRound,
  CircleArrowDown,
  CircleArrowUp,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CircleAlert,
  LucideIcon,
} from 'lucide-react-native';
import { Colors, Sizes } from '../../theme';

export type IconName =
  | 'home'
  | 'list'
  | 'chart'
  | 'more'
  | 'moreVertical'
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
  | 'chevronLeft'
  | 'chevronDown'
  | 'payments'
  | 'eye'
  | 'mail'
  | 'lock'
  | 'user'
  | 'arrowDown'
  | 'arrowUp'
  | 'trendingUp'
  | 'trendingDown'
  | 'dollar'
  | 'alert';

const iconMap: Record<IconName, LucideIcon> = {
  home: House,
  list: List,
  chart: ChartNoAxesCombined,
  more: MoreHorizontal,
  moreVertical: MoreVertical,
  plus: Plus,
  wallet: Wallet,
  check: Check,
  bulb: Lightbulb,
  calendar: CalendarDays,
  tag: Tag,
  note: FileText,
  arrow: ArrowLeft,
  settings: Settings,
  help: CircleHelp,
  info: Info,
  logout: LogOut,
  store: Store,
  package: Package,
  bus: Truck,
  sparkle: Sparkles,
  clock: Clock,
  chevron: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  payments: CreditCard,
  eye: Eye,
  mail: Mail,
  lock: Lock,
  user: UserRound,
  arrowDown: CircleArrowDown,
  arrowUp: CircleArrowUp,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  dollar: DollarSign,
  alert: CircleAlert,
};

interface Props {
  name?: IconName;
  symbol?: string;
  color?: string;
  size?: number;
  filled?: boolean;
  strokeWidth?: number;
}

export function Icon({
  name,
  color = Colors.brand,
  size = Sizes.icon,
  filled = false,
  strokeWidth = 2.2,
}: Props) {
  const IconComponent = name ? iconMap[name] : null;

  if (!IconComponent) {
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <IconComponent
        color={color}
        size={size}
        strokeWidth={strokeWidth}
        fill={filled ? color : 'none'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
