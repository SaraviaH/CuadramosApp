import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppButton, AppText, IconBox } from '../../atoms';
import { OperationalDataSummary } from '../../services/storage/dataCleanupService';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isCleaning?: boolean;
  summary?: OperationalDataSummary | null;
}

export function CleanDataModal({ visible, onCancel, onConfirm, isCleaning = false, summary }: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={isCleaning ? undefined : onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <IconBox
            name="alert"
            color={Colors.red}
            backgroundColor={Colors.redLight}
            size={52}
            iconSize={24}
            shape="rounded"
            style={styles.iconBox}
          />

          <AppText variant="subtitle" style={styles.title}>
            ¿Eliminar datos operativos?
          </AppText>

          <AppText variant="body" style={styles.description}>
            ¿Deseas eliminar los datos operativos guardados en este dispositivo? Esta acción no se puede deshacer. Los datos que no tengan respaldo podrían perderse.
          </AppText>

          {/* Advertencias específicas según el estado actual */}
          <View style={styles.warningsList}>
            {summary?.hasOpenJornada && (
              <View style={styles.warningItem}>
                <AppText style={styles.warningBullet}>•</AppText>
                <AppText style={styles.warningText}>
                  Tienes una caja actualmente abierta. Se cancelará la jornada en curso.
                </AppText>
              </View>
            )}

            {Boolean(summary?.pendingSyncCount && summary.pendingSyncCount > 0) && (
              <View style={styles.warningItem}>
                <AppText style={styles.warningBullet}>•</AppText>
                <AppText style={styles.warningText}>
                  Hay {summary?.pendingSyncCount} registros pendientes de sincronización que se descartarán.
                </AppText>
              </View>
            )}

            {summary?.isGuest ? (
              <View style={styles.warningItem}>
                <AppText style={styles.warningBullet}>•</AppText>
                <AppText style={styles.warningText}>
                  Modo sin cuenta: Los registros no tienen respaldo en la nube y se perderán de forma definitiva.
                </AppText>
              </View>
            ) : (
              <View style={styles.infoItem}>
                <AppText style={styles.infoBullet}>ℹ</AppText>
                <AppText style={styles.infoText}>
                  Tus datos en la nube no se eliminarán. Esta acción solo libera el almacenamiento en este teléfono.
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              onPress={onCancel}
              disabled={isCleaning}
              style={({ pressed }) => [
                styles.cancelButton,
                { opacity: pressed || isCleaning ? 0.7 : 1 },
              ]}
            >
              <AppText variant="label" style={styles.cancelText}>
                Cancelar
              </AppText>
            </Pressable>

            <View style={styles.confirmWrap}>
              <AppButton
                tone="red"
                variant="danger"
                label="Eliminar datos"
                loading={isCleaning}
                disabled={isCleaning}
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
    maxWidth: 340,
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
    marginBottom: Spacing.sm,
  },
  warningsList: {
    width: '100%',
    backgroundColor: Colors.neutralSoft,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 6,
    marginBottom: Spacing.md,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  warningBullet: {
    fontSize: 14,
    color: Colors.danger,
    lineHeight: 18,
    fontWeight: '800',
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.danger,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  infoBullet: {
    fontSize: 12,
    color: Colors.brandDark,
    lineHeight: 16,
    fontWeight: '800',
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.text,
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

