import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { Sizes, Spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  padded?: boolean;
}

const DEFAULT_INSETS = { top: 0, bottom: 0, left: 0, right: 0 };

export const ScreenContainer = React.forwardRef<React.ComponentRef<typeof ScrollView>, Props>(
  function ScreenContainerImpl(
    { children, contentContainerStyle, keyboardShouldPersistTaps, padded = true },
    ref,
  ) {
    // Usamos el contexto directamente con reserva para no depender de que exista
    // un `SafeAreaProvider` (p. ej. en pruebas que montan la pantalla aislada).
    const insets = React.useContext(SafeAreaInsetsContext) ?? DEFAULT_INSETS;

    // Con edge-to-edge Android ya no redimensiona la ventana al abrir el teclado
    // (ignora `adjustResize`), por eso evitamos que tape los inputs con padding.
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          ref={ref}
          contentContainerStyle={[styles.centered, padded && styles.padded, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  },
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    width: '100%',
    maxWidth: Sizes.contentWidth,
    alignSelf: 'center',
  },
  padded: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
});
