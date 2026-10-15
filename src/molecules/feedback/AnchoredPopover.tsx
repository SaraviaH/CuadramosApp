import React, { useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUBBLE_MAX_WIDTH = Math.min(SCREEN_WIDTH - 32, 300);

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  /** Etiqueta accesible del botón que abre el globo. */
  accessibilityLabel: string;
  /** Contenido del botón; recibe si el globo está abierto. */
  renderTrigger: (open: boolean) => React.ReactNode;
  /** Contenido del globo; recibe `close` para cerrarlo desde un ítem. */
  children: (close: () => void) => React.ReactNode;
}

/**
 * Globo flotante anclado a un botón (trigger). Mide la posición del trigger y
 * muestra su contenido debajo, alineado a la derecha. Tocar fuera lo cierra.
 */
export function AnchoredPopover({ accessibilityLabel, renderTrigger, children }: Props) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<React.ComponentRef<typeof View>>(null);

  const close = () => setOpen(false);

  const handleOpen = () => {
    const node = triggerRef.current;
    if (!node) {
      setOpen(true);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  const toggle = () => {
    if (open) {
      close();
    } else {
      handleOpen();
    }
  };

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ expanded: open }}
          hitSlop={8}
          onPress={toggle}
        >
          {renderTrigger(open)}
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          style={styles.backdrop}
          onPress={close}
        >
          {anchor ? (
            <Pressable
              onPress={() => {}}
              style={[
                styles.bubble,
                {
                  top: anchor.y + anchor.height + 6,
                  right: Math.max(SCREEN_WIDTH - (anchor.x + anchor.width), 12),
                },
              ]}
            >
              {children(close)}
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  bubble: {
    position: 'absolute',
    maxWidth: BUBBLE_MAX_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    ...Shadows.card,
  },
});
