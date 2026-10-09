import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon, IconName } from '../../atoms';
import { TabPrincipal } from '../../types';

interface TabItem {
  key: TabPrincipal;
  label: string;
  icon: IconName;
}

const TABS: TabItem[] = [
  { key: 'INICIO', label: 'Inicio', icon: 'home' },
  { key: 'MOVIMIENTOS', label: 'Movimientos', icon: 'list' },
  { key: 'RESUMEN', label: 'Resumen', icon: 'chart' },
  { key: 'MAS', label: 'Más', icon: 'more' },
];

interface Props {
  activeTab: TabPrincipal;
  onSelectTab: (tab: TabPrincipal) => void;
}

export function BottomNav({ activeTab, onSelectTab }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            onPress={() => onSelectTab(tab.key)}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
          >
            <Icon
              name={tab.icon}
              color={isActive ? Colors.brand : Colors.muted}
              size={20}
            />
            <AppText
              numberOfLines={1}
              style={[styles.tabLabel, isActive && styles.activeTabLabel]}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingHorizontal: Spacing.xs,
    paddingBottom: 4,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radius.md,
    gap: 3,
  },
  activeTabButton: {
    backgroundColor: Colors.brandSoft,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.muted,
  },
  activeTabLabel: {
    color: Colors.brand,
    fontWeight: '800',
  },
});
