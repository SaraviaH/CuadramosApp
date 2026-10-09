import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from '../../atoms';
import { BrandHeader, MovementCard, ScreenTitle, SummaryCard } from '../../molecules';
import { BoxHistoryList, ReconciliationPanel } from '../../organisms';
import { loadBoxHistory } from '../../storage/repositories/boxHistoryRepository';
import { RegistroHistorialCaja } from '../../types';

interface Props {
  goBack: () => void;
}

export function BoxHistoryScreen({ goBack }: Props) {
  const [boxes, setBoxes] = useState<RegistroHistorialCaja[]>([]);
  const [selectedBox, setSelectedBox] = useState<RegistroHistorialCaja | null>(null);

  useEffect(() => {
    loadBoxHistory().then(setBoxes);
  }, []);

  if (selectedBox) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <BrandHeader back onBack={() => setSelectedBox(null)} />
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
          <View style={{ flex: 1 }}>
            <SummaryCard
              label="Ingresos"
              tone="income"
              value={`+ S/ ${selectedBox.ingresos.toFixed(2)}`}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SummaryCard
              label="Gastos"
              tone="expense"
              value={`− S/ ${selectedBox.gastos.toFixed(2)}`}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SummaryCard
              label="Retiros"
              tone="warning"
              value={`S/ ${selectedBox.retiros.toFixed(2)}`}
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
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BrandHeader back onBack={goBack} />
      <ScreenTitle
        title="Historial de cajas"
        subtitle="Consulta el registro y arqueo de tus jornadas anteriores."
      />

      <BoxHistoryList boxes={boxes} onSelectBox={setSelectedBox} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  movementsSection: {
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  movementsHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.ink,
    marginBottom: 4,
  },
  movementsList: {
    gap: 8,
  },
});
