import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '../../theme';
import { BrandHeader, ScreenTitle } from '../../molecules';
import { MovementList } from '../../organisms';
import { useJornada } from '../../hooks';
import { Ruta } from '../../types';

interface Props {
  navigate?: (route: Ruta) => void;
  goBack?: () => void;
}

export function MovementHistoryScreen({ navigate }: Props) {
  const { movimientos } = useJornada();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <BrandHeader />
      <ScreenTitle title="Movimientos" />

      <MovementList
        movements={movimientos}
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
