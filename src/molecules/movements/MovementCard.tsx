import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon, IconBox } from '../../atoms';
import { formatFriendlyTime, formatSignedCurrency } from '../../utils';
import { getTipoVisual } from './movementVisuals';
import { Movimiento } from '../../types';

interface Props {
  movement: Movimiento;
}

const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre',
];

export function MovementCard({ movement }: Props) {
  const isIncome = movement.tipo === 'INGRESO';
  const isExpense = movement.tipo === 'EGRESO';

  const { icon: iconName, color: toneColor, background: toneBg } = getTipoVisual(movement.tipo);

  // Formato numérico estricto con separadores de millares y dos decimales
  const formattedAmount = formatSignedCurrency(
    movement.monto,
    isIncome ? 'income' : isExpense ? 'expense' : 'neutral',
  );

  const categoryLabel = movement.categoria || movement.concepto || 'General';
  const title = movement.concepto || movement.descripcion || 'Movimiento';
  const hasDistinctDescription =
    movement.descripcion &&
    movement.descripcion.trim().toLowerCase() !== title.trim().toLowerCase() &&
    movement.descripcion.trim().toLowerCase() !== categoryLabel.trim().toLowerCase();

  // Fecha legible para la tarjeta
  const formattedDate = (() => {
    if (movement.fechaLegible) {
      return movement.fechaLegible.replace(/^Hoy,\s*/i, '');
    }
    if (movement.fechaHoraOrigen) {
      try {
        const d = new Date(movement.fechaHoraOrigen);
        if (!isNaN(d.getTime())) {
          return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`;
        }
      } catch {}
    }
    return '';
  })();

  // Hora exacta limpia
  const exactTime = (() => {
    if (movement.horaLegible) return movement.horaLegible;
    if (movement.fechaHoraOrigen) {
      try {
        const d = new Date(movement.fechaHoraOrigen);
        if (!isNaN(d.getTime())) return formatFriendlyTime(d);
      } catch {}
    }
    return '';
  })();

  const paymentMethod = movement.metodoPago || 'Efectivo';
  const isDigital =
    paymentMethod.toLowerCase().includes('yape') ||
    paymentMethod.toLowerCase().includes('plin') ||
    paymentMethod.toLowerCase().includes('tarjeta') ||
    paymentMethod.toLowerCase().includes('transferencia');

  return (
    <View style={styles.card}>
      <IconBox
        name={iconName}
        color={toneColor}
        backgroundColor={toneBg}
        size={40}
        iconSize={18}
        shape="card"
      />

      <View style={styles.details}>
        <View style={styles.topRow}>
          <View style={[styles.categoryBadge, { backgroundColor: toneBg }]}>
            <AppText numberOfLines={1} style={[styles.categoryText, { color: toneColor }]}>
              {categoryLabel}
            </AppText>
          </View>
        </View>

        {/* Nombre / Concepto con soporte de múltiples líneas */}
        <AppText numberOfLines={3} style={styles.title}>
          {title}
        </AppText>

        {/* Descripción extensa multilínea si difiere del título */}
        {hasDistinctDescription && (
          <AppText numberOfLines={3} style={styles.description}>
            {movement.descripcion}
          </AppText>
        )}

        {/* Fila de metadatos flexible sin truncamientos */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name={isDigital ? 'payments' : 'wallet'} size={11} color={Colors.text} />
            <AppText style={styles.metaText}>{paymentMethod}</AppText>
          </View>

          {formattedDate ? (
            <>
              <AppText style={styles.metaDot}>·</AppText>
              <View style={styles.metaItem}>
                <Icon name="calendar" size={11} color={Colors.text} />
                <AppText style={styles.metaText}>{formattedDate}</AppText>
              </View>
            </>
          ) : null}

          {exactTime ? (
            <>
              <AppText style={styles.metaDot}>·</AppText>
              <View style={styles.metaItem}>
                <Icon name="clock" size={11} color={Colors.text} />
                <AppText style={styles.metaText}>{exactTime}</AppText>
              </View>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.amountWrap}>
        <AppText
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.amount, { color: toneColor }]}
        >
          {formattedAmount}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
  },
  description: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaDot: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '700',
  },
  metaText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    fontWeight: '500',
  },
  amountWrap: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: Spacing.xs,
  },
  amount: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
