import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AmountDisplay, AppButton, AppText, Card, StatusBadge } from '../../atoms';
import { EventoPago } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';
import { formatDate, formatTime } from '../../utils';

interface Props {
  event: EventoPago;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PendingEventItem({ event, onConfirm, onCancel }: Props) {
  const isReceived = event.tipoEvento === 'PAGO_RECIBIDO';
  const typeText = isReceived ? 'Pago por cobrar' : 'Pago por pagar';

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <View style={styles.badgeRow}>
            <StatusBadge label="Pendiente de confirmación" tone="warning" showDot />
            <AppText variant="caption" color={Colors.textMuted}>
              {event.origenReferencia}
            </AppText>
          </View>
          <AppText variant="heading" color={Colors.text} numberOfLines={2}>
            {event.concepto}
          </AppText>
          <AppText variant="caption" color={Colors.textMuted}>
            {`${typeText} · ${formatDate(event.fechaHoraEvento)} ${formatTime(event.fechaHoraEvento)}`}
          </AppText>
        </View>

        <View style={styles.amountCol}>
          <AmountDisplay
            amount={event.monto}
            tone={isReceived ? 'success' : 'danger'}
            size="md"
            prefix={isReceived ? '+' : '-'}
            style={styles.amountText}
          />
        </View>
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.actionCol}>
          <AppButton
            label="Descartar"
            variant="ghost"
            onPress={onCancel}
          />
        </View>
        <View style={styles.actionCol}>
          <AppButton
            label="✓ Confirmar e ingresar"
            variant="primary"
            onPress={onConfirm}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm + 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  leftCol: {
    flex: 1,
    gap: Spacing.xxs + 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  amountCol: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  amountText: {
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionCol: {
    flex: 1,
  },
});

