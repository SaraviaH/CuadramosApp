import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppButton, AppText, IconBox } from '../../atoms';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ visible, onCancel, onConfirm }: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <IconBox
            name="logout"
            color={Colors.red}
            backgroundColor={Colors.redLight}
            size={50}
            iconSize={22}
            shape="rounded"
            style={styles.iconBox}
          />
          <AppText variant="subtitle" style={styles.title}>¿Quieres cerrar sesión?</AppText>
          <AppText variant="body" style={styles.description}>
            Podrás seguir utilizando todas las funciones de la aplicación en modo libre sin perder tus registros locales.
          </AppText>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <AppText variant="label" style={styles.cancelText}>Cancelar</AppText>
            </Pressable>
            <View style={styles.confirmWrap}>
              <AppButton
                tone="red"
                label="Cerrar sesión"
                onPress={onConfirm}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  iconBox: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.subtitle.fontSize,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.micro.fontSize,
    lineHeight: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: Radius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.neutralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  confirmWrap: {
    flex: 1,
  },
  confirmButton: {
    minHeight: 46,
  },
});
