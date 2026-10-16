import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../theme';
import { BackButton, InfoTip, MovementCard, ScreenContainer, ScreenTitle, SectionHeader, SummaryCard } from '../../molecules';
import { BoxHistoryList, ReconciliationPanel } from '../../organisms';
import { loadBoxHistory } from '../../storage/repositories/boxHistoryRepository';
import { jornadaSqliteRepository, movimientoSqliteRepository } from '../../storage';
import { RegistroHistorialCaja, Ruta } from '../../types';
import { formatAmount, formatBoxDate, formatFriendlyDate, formatFriendlyTime } from '../../utils/formatters/format';

interface Props {
  /** Solo se usa cuando la pantalla se abre como detalle (con botón Volver). */
  goBack?: () => void;
  navigate?: (route: Ruta) => void;
}

export function BoxHistoryScreen({ goBack, navigate }: Props) {
  const [boxes, setBoxes] = useState<RegistroHistorialCaja[]>([]);
  const [selectedBox, setSelectedBox] = useState<RegistroHistorialCaja | null>(null);
  const [openBoxId, setOpenBoxId] = useState<string | null>(null);

  const loadBoxes = useCallback(async () => {
    const closedBoxes = await loadBoxHistory();
    const activeJornada = await jornadaSqliteRepository.getActiveJornada();

    if (activeJornada && !closedBoxes.some(b => b.id === activeJornada.id)) {
      const activeMovements = await movimientoSqliteRepository.getMovimientosByJornadaId(activeJornada.id);
      const ingresos = activeMovements.filter(m => m.tipo === 'INGRESO').reduce((a, m) => a + m.monto, 0);
      const gastos = activeMovements.filter(m => m.tipo === 'EGRESO').reduce((a, m) => a + m.monto, 0);
      const current = activeJornada.saldoInicial + ingresos - gastos;

      const openBoxRecord: RegistroHistorialCaja = {
        id: activeJornada.id,
        userId: activeJornada.userId,
        fecha: formatFriendlyDate(new Date(activeJornada.fechaHoraApertura)),
        fechaHoraApertura: activeJornada.fechaHoraApertura,
        horaApertura: formatFriendlyTime(new Date(activeJornada.fechaHoraApertura)),
        horaCierre: 'En curso (Abierta)',
        saldoInicial: activeJornada.saldoInicial,
        ingresos,
        gastos,
        retiros: 0,
        saldoEsperado: current,
        saldoReal: current,
        diferencia: 0,
        movimientos: activeMovements,
        syncStatus: activeJornada.syncStatus,
      };
      setBoxes([openBoxRecord, ...closedBoxes]);
      setOpenBoxId(activeJornada.id);
    } else {
      setBoxes(closedBoxes);
      setOpenBoxId(null);
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
        <ScreenTitle
          left={<BackButton onPress={() => setSelectedBox(null)} />}
          title="Detalle de caja"
          subtitle={`${formatBoxDate(selectedBox.fechaHoraApertura, selectedBox.fecha)} · ${selectedBox.horaApertura} – ${selectedBox.horaCierre}`}
        />

        {/* Arqueo de la jornada seleccionada */}
        <ReconciliationPanel
          saldoEsperado={selectedBox.saldoEsperado}
          saldoReal={selectedBox.saldoReal}
          diferencia={selectedBox.diferencia}
        />

        {/* Resumen de ingresos y gastos */}
        <View style={styles.statsRow}>
          <View style={styles.col}>
            <SummaryCard
              label="Ingresos"
              tone="income"
              value={formatAmount(selectedBox.ingresos)}
            />
          </View>
          <View style={styles.col}>
            <SummaryCard
              label="Gastos"
              tone="expense"
              value={formatAmount(selectedBox.gastos)}
            />
          </View>
        </View>

        {/* Lista de movimientos de esa jornada */}
        <View style={styles.movementsSection}>
          <SectionHeader
            icon="clock"
            title="Movimientos de la jornada"
            badge={String(selectedBox.movimientos.length)}
          />
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
      <ScreenTitle
        left={goBack ? <BackButton onPress={goBack} /> : undefined}
        title="Historial de cajas"
        right={
          <InfoTip
            accessibilityLabel="Información sobre el historial de cajas"
            text="Consulta el registro y arqueo de tus jornadas anteriores."
          />
        }
      />

      <BoxHistoryList
        boxes={boxes}
        onSelectBox={handleSelectBox}
        openBoxId={openBoxId}
        onOpenDay={navigate ? () => navigate('ABRIR_JORNADA') : undefined}
      />
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
  },
  movementsList: {
    gap: 8,
  },
});
