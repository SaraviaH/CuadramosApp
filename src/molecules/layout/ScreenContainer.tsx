import React from 'react';
import { ScrollView, ScrollViewProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  padded?: boolean;
}

export function ScreenContainer({
  children,
  contentContainerStyle,
  keyboardShouldPersistTaps,
  padded = true,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={[padded && styles.padded, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  padded: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
