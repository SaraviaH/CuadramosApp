import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppText, Card } from '../../atoms';
import { BalanceSummary } from '../../molecules';
import { Balance } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';

interface Props {
  balance: Balance;
  pendingCount: number;
  onClose: () => void;
  loading?: boolean;
}

export function CloseDayPanel({ balance, pendingCount, onClose, loading }: Props) {
  const isBlocked = pendingCount > 0;

  return (
    <View style={styles.container}>
      {/* Resumen del Balance de la jornada */}
      <BalanceSummary balance={balance} />

      {/* Tarjeta de validación de cierre */}
      <Card
        style={[
          styles.statusCard,
          isBlocked ? styles.blockedCard : styles.readyCard,
        ]}
      >
        <View style={styles.statusHeader}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isBlocked ? Colors.dangerSoft : Colors.successSoft },
            ]}
          >
            <AppText
              variant="subheading"
              color={isBlocked ? Colors.danger : Colors.success}
            >
              {isBlocked ? '!' : '✓'}
            </AppText>
          </View>

          <View style={styles.statusCopy}>
            <AppText
              variant="captionBold"
              color={isBlocked ? Colors.danger : Colors.success}
              style={styles.statusBadge}
            >
              {isBlocked ? 'CIERRE BLOQUEADO' : 'LISTO PARA CUADRAR'}
            </AppText>
            <AppText variant="heading" color={Colors.text}>
              {isBlocked
                ? `Hay ${pendingCount} pago${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''}`
                : 'Todos los pagos están procesados'}
            </AppText>
          </View>
        </View>

        <AppText variant="body" color={Colors.textMuted} style={styles.statusDetail}>
          {isBlocked
            ? 'Por seguridad contable, no puedes cerrar la jornada mientras existan pagos pendientes de confirmación o cancelación.'
            : 'Tu arqueo de caja coincide con los movimientos registrados. Al cerrar, esta jornada quedará registrada de forma inmutable.'}
        </AppText>

        <View style={styles.actionRow}>
          <AppButton
            label={isBlocked ? '🔒 Cierre bloqueado por pendientes' : '✓ Cerrar jornada definitivamente'}
            variant={isBlocked ? 'ghost' : 'danger'}
            disabled={isBlocked}
            loading={loading}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  statusCard: {
    gap: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1.5,
  },
  blockedCard: {
    backgroundColor: Colors.dangerSoft,
    borderColor: 'rgba(199, 58, 58, 0.35)',
  },
  readyCard: {
    backgroundColor: Colors.successSoft,
    borderColor: 'rgba(24, 134, 75, 0.30)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCopy: {
    flex: 1,
    gap: 2,
  },
  statusBadge: {
    letterSpacing: 0.6,
  },
  statusDetail: {
    lineHeight: 20,
  },
  actionRow: {
    marginTop: Spacing.xs,
  },
  closeButton: {
    minHeight: 52,
  },
});

