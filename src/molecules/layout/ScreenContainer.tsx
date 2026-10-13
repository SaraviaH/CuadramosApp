import React from 'react';
import { ScrollView, ScrollViewProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Sizes, Spacing } from '../../theme';

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
      contentContainerStyle={[styles.centered, padded && styles.padded, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    width: '100%',
    maxWidth: Sizes.contentWidth,
    alignSelf: 'center',
  },
  padded: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
