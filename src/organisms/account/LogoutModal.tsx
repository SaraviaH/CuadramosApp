import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppText, Icon } from '../../atoms';

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
          <View style={styles.iconWrap}>
            <Icon name="logout" color={Colors.red} size={22} />
          </View>
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
            <View style={{ flex: 1 }}>
              <AppButton
                tone="red"
                label="Cerrar sesión"
                onPress={onConfirm}
                style={{ minHeight: 46 }}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.redLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.ink,
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.muted,
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
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.line,
    backgroundColor: '#F7F7F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.ink,
  },
});
