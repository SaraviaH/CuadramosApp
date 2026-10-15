import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
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

  const categoryLabel = (movement.categoria || movement.concepto || 'General').trim();
  const description = (movement.descripcion || '').trim();
  const concept = (movement.concepto || '').trim();

  // Título: la descripción aporta más contexto que el concepto (que suele repetir
  // la categoría). Si coincide con la categoría, se oculta el chip para no duplicar.
  const hasDistinctDescription =
    description.length > 0 && description.toLowerCase() !== categoryLabel.toLowerCase();
  const title = hasDistinctDescription ? description : concept || categoryLabel;
  const showCategoryChip = categoryLabel.toLowerCase() !== title.toLowerCase();

  // Fecha legible para el pie de la tarjeta
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
      <View style={styles.main}>
        <IconBox
          name={iconName}
          color={toneColor}
          backgroundColor={toneBg}
          size={40}
          iconSize={18}
          shape="card"
        />

        <View style={styles.details}>
          <AppText numberOfLines={3} style={styles.title}>
            {title}
          </AppText>

          {showCategoryChip && (
            <View style={[styles.categoryBadge, { backgroundColor: toneBg }]}>
              <AppText numberOfLines={1} style={[styles.categoryText, { color: toneColor }]}>
                {categoryLabel}
              </AppText>
            </View>
          )}
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

      <View style={styles.divider} />

      {/* Pie: método de pago · fecha · hora */}
      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Icon name={isDigital ? 'payments' : 'wallet'} size={12} color={Colors.text} />
          <AppText style={styles.metaText}>{paymentMethod}</AppText>
        </View>

        {formattedDate ? (
          <View style={styles.metaItem}>
            <Icon name="calendar" size={12} color={Colors.text} />
            <AppText style={styles.metaText}>{formattedDate}</AppText>
          </View>
        ) : null}

        {exactTime ? (
          <View style={styles.metaItem}>
            <Icon name="clock" size={12} color={Colors.text} />
            <AppText style={styles.metaText}>{exactTime}</AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Surfaces.card,
    minHeight: 76,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
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
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    fontWeight: '500',
  },
});
