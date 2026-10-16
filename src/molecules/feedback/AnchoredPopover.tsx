import React, { useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MARGIN = 12;
const BUBBLE_MAX_WIDTH = Math.min(SCREEN_WIDTH - MARGIN * 2, 300);
/** Cuánto debe caber debajo para abrir el globo hacia abajo. */
const MIN_VERTICAL_SPACE = 220;

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
  /** Lado del trigger al que se ancla el globo. Por defecto, a la derecha. */
  align?: 'left' | 'right';
}

/**
 * Globo flotante anclado a un botón (trigger). Mide la posición del trigger y
 * muestra su contenido debajo, evitando salirse de la pantalla (se ajusta a
 * los márgenes horizontal y vertical). Tocar fuera lo cierra.
 */
export function AnchoredPopover({
  accessibilityLabel,
  renderTrigger,
  children,
  align = 'right',
}: Props) {
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

  // Posición con ajuste a pantalla: se elige el lado del trigger permitido y
  // se limita para que el globo nunca se corte por los bordes.
  const maxOffset = Math.max(MARGIN, SCREEN_WIDTH - MARGIN - BUBBLE_MAX_WIDTH);
  const spaceBelow = anchor ? SCREEN_HEIGHT - (anchor.y + anchor.height) : 0;
  const openUpward = Boolean(anchor && spaceBelow < MIN_VERTICAL_SPACE && anchor.y > MIN_VERTICAL_SPACE);

  const position = anchor
    ? {
        ...(align === 'left'
          ? { left: Math.min(Math.max(anchor.x, MARGIN), maxOffset) }
          : {
              right: Math.min(
                Math.max(SCREEN_WIDTH - (anchor.x + anchor.width), MARGIN),
                maxOffset,
              ),
            }),
        ...(openUpward
          ? { bottom: SCREEN_HEIGHT - anchor.y + 6 }
          : { top: anchor.y + anchor.height + 6 }),
      }
    : null;

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
          {position ? (
            <Pressable onPress={() => {}} style={[styles.bubble, position]}>
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
