import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, StatusBadge } from '../../atoms';
import { useJornada } from '../../hooks';
import { MovementList, ScreenLayout } from '../../organisms';
import { Colors, Spacing } from '../../theme';

interface Props {
  goBack: () => void;
}

export function MovementHistoryScreen({ goBack }: Props) {
  const { movimientos, notification, dismissNotification } = useJornada();

  const total = movimientos.length;
  const ingresosCount = movimientos.filter(m => m.tipo === 'INGRESO').length;
  const salidasCount = movimientos.filter(m => m.tipo !== 'INGRESO').length;

  return (
    <ScreenLayout
      title="Historial de movimientos"
      subtitle="Registro cronológico de entradas y salidas de la jornada activa."
      onBack={goBack}
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      <View style={styles.summaryBar}>
        <View style={styles.badgeRow}>
          <StatusBadge
            label={`${total} MOVIMIENTO${total === 1 ? '' : 'S'}`}
            tone="brand"
          />
          {total > 0 ? (
            <>
              <StatusBadge
                label={`${ingresosCount} ingresos`}
                tone="success"
              />
              <StatusBadge
                label={`${salidasCount} salidas`}
                tone="danger"
              />
            </>
          ) : null}
        </View>
        <AppText variant="caption" color={Colors.textMuted}>
          Ordenados del más reciente al más antiguo
        </AppText>
      </View>

      <MovementList
        movements={movimientos}
        emptyTitle="No hay movimientos aún"
        emptyMessage="Registra ventas, gastos de insumos o retiros para que aparezcan en este historial."
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  summaryBar: {
    gap: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
});

