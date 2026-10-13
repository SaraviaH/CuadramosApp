import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';
import { BackButton, MovementCard, ScreenContainer, ScreenTitle, SummaryCard } from '../../molecules';
import { BoxHistoryList, ReconciliationPanel } from '../../organisms';
import { loadBoxHistory } from '../../storage/repositories/boxHistoryRepository';
import { jornadaSqliteRepository, movimientoSqliteRepository } from '../../storage';
import { RegistroHistorialCaja } from '../../types';
import { formatAmount, formatFriendlyDate, formatFriendlyTime, formatSignedCurrency } from '../../utils/formatters/format';

interface Props {
  goBack: () => void;
}

export function BoxHistoryScreen({ goBack }: Props) {
  const [boxes, setBoxes] = useState<RegistroHistorialCaja[]>([]);
  const [selectedBox, setSelectedBox] = useState<RegistroHistorialCaja | null>(null);

  const loadBoxes = useCallback(async () => {
    const closedBoxes = await loadBoxHistory();
    const activeJornada = await jornadaSqliteRepository.getActiveJornada();

    if (activeJornada && !closedBoxes.some(b => b.id === activeJornada.id)) {
      const activeMovements = await movimientoSqliteRepository.getMovimientosByJornadaId(activeJornada.id);
      const ingresos = activeMovements.filter(m => m.tipo === 'INGRESO').reduce((a, m) => a + m.monto, 0);
      const gastos = activeMovements.filter(m => m.tipo === 'EGRESO').reduce((a, m) => a + m.monto, 0);
      const retiros = activeMovements.filter(m => m.tipo === 'RETIRO').reduce((a, m) => a + m.monto, 0);
      const current = activeJornada.saldoInicial + ingresos - gastos - retiros;

      const openBoxRecord: RegistroHistorialCaja = {
        id: activeJornada.id,
        userId: activeJornada.userId,
        fecha: formatFriendlyDate(new Date(activeJornada.fechaHoraApertura)),
        horaApertura: formatFriendlyTime(new Date(activeJornada.fechaHoraApertura)),
        horaCierre: 'En curso (Abierta)',
        saldoInicial: activeJornada.saldoInicial,
        ingresos,
        gastos,
        retiros,
        saldoEsperado: current,
        saldoReal: current,
        diferencia: 0,
        movimientos: activeMovements,
        syncStatus: activeJornada.syncStatus,
      };
      setBoxes([openBoxRecord, ...closedBoxes]);
    } else {
      setBoxes(closedBoxes);
    }
  }, []);

  useEffect(() => {
    loadBoxes();
  }, [loadBoxes]);

  const handleSelectBox = async (box: RegistroHistorialCaja) => {
    const persistedMovements = await movimientoSqliteRepository.getMovimientosByJornadaId(box.id);
    const resolvedMovements = persistedMovements.length > 0 ? persistedMovements : box.movimientos || [];
    setSelectedBox({
      ...box,
      movimientos: resolvedMovements,
    });
  };

  if (selectedBox) {
    return (
      <ScreenContainer>
        <BackButton onPress={() => setSelectedBox(null)} />
        <ScreenTitle
          title="Detalle de caja"
          subtitle={`${selectedBox.fecha} · ${selectedBox.horaApertura} – ${selectedBox.horaCierre}`}
        />

        {/* Arqueo de la jornada seleccionada */}
        <ReconciliationPanel
          saldoEsperado={selectedBox.saldoEsperado}
          saldoReal={selectedBox.saldoReal}
          diferencia={selectedBox.diferencia}
        />

        {/* Resumen de ingresos, gastos y retiros */}
        <View style={styles.statsRow}>
          <View style={styles.col}>
            <SummaryCard
              label="Ingresos"
              tone="income"
              value={formatSignedCurrency(selectedBox.ingresos, 'income')}
            />
          </View>
          <View style={styles.col}>
            <SummaryCard
              label="Gastos"
              tone="expense"
              value={formatSignedCurrency(selectedBox.gastos, 'expense')}
            />
          </View>
          <View style={styles.col}>
            <SummaryCard
              label="Retiros"
              tone="warning"
              value={formatAmount(selectedBox.retiros)}
            />
          </View>
        </View>

        {/* Lista de movimientos de esa jornada */}
        <View style={styles.movementsSection}>
          <AppText variant="subtitle" style={styles.movementsHeading}>
            Movimientos de la jornada ({selectedBox.movimientos.length})
          </AppText>
          <View style={styles.movementsList}>
            {selectedBox.movimientos.map(item => (
              <MovementCard key={item.id} movement={item} />
            ))}
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <BackButton onPress={goBack} />
      <ScreenTitle
        title="Historial de cajas"
        subtitle="Consulta el registro y arqueo de tus jornadas anteriores."
      />

      <BoxHistoryList boxes={boxes} onSelectBox={handleSelectBox} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  col: {
    flex: 1,
  },
  movementsSection: {
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  movementsHeading: {
    fontSize: Typography.body.fontSize,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  movementsList: {
    gap: 8,
  },
});
