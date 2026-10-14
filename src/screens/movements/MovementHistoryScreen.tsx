import React from 'react';
import { ScreenContainer, ScreenTitle } from '../../molecules';
import { MovementList } from '../../organisms';
import { useJornada } from '../../hooks';
import { Ruta, TipoMovimiento } from '../../types';

interface Props {
  navigate?: (route: Ruta) => void;
  goBack?: () => void;
  initialFilter?: TipoMovimiento | 'TODOS';
}

export function MovementHistoryScreen({ navigate, initialFilter }: Props) {
  const { allMovimientos } = useJornada();

  return (
    <ScreenContainer>
      <ScreenTitle title="Movimientos" subtitle="Consulta todas tus ventas y gastos registrados." />

      <MovementList
        movements={allMovimientos}
        initialTypeFilter={initialFilter}
        onAddPress={() => navigate?.('NUEVO_MOVIMIENTO')}
      />
    </ScreenContainer>
  );
}
