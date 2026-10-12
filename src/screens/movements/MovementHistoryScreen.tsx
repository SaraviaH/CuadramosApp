import React from 'react';
import { BrandHeader, ScreenContainer, ScreenTitle } from '../../molecules';
import { MovementList } from '../../organisms';
import { useJornada } from '../../hooks';
import { Ruta } from '../../types';
import { ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '../../theme';

interface Props {
  navigate?: (route: Ruta) => void;
  goBack?: () => void;
}

export function MovementHistoryScreen({ navigate }: Props) {
  const { allMovimientos } = useJornada();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <BrandHeader />
      <ScreenTitle title="Movimientos" subtitle="Consulta todas tus ventas, gastos y retiros registrados." />

      <MovementList
        movements={allMovimientos}
        onAddPress={() => navigate?.('NUEVO_MOVIMIENTO')}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});