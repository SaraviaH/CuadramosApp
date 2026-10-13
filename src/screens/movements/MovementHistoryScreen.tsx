import React from 'react';
import { ScreenContainer, ScreenTitle } from '../../molecules';
import { MovementList } from '../../organisms';
import { useJornada } from '../../hooks';
import { Ruta } from '../../types';

interface Props {
  navigate?: (route: Ruta) => void;
  goBack?: () => void;
}

export function MovementHistoryScreen({ navigate }: Props) {
  const { allMovimientos } = useJornada();

  return (
    <ScreenContainer>
      <ScreenTitle title="Movimientos" subtitle="Consulta todas tus ventas, gastos y retiros registrados." />

      <MovementList
        movements={allMovimientos}
        onAddPress={() => navigate?.('NUEVO_MOVIMIENTO')}
      />
    </ScreenContainer>
  );
}
