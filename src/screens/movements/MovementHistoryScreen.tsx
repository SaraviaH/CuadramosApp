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
  const { movimientos } = useJornada();

  return (
    <ScreenContainer>
      <ScreenTitle title="Movimientos" />

      <MovementList
        movements={movimientos}
        onAddPress={() => navigate?.('NUEVO_MOVIMIENTO')}
      />
    </ScreenContainer>
  );
}
