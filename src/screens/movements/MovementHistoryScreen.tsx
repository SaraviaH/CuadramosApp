import React from 'react';
import { ScreenContainer, ScreenTitle } from '../../molecules';
import { MovementList } from '../../organisms';
import { NavigateFn } from '../../types';

interface Props {
  navigate?: NavigateFn;
  goBack?: () => void;
  initialFilter?: string;
}

export function MovementHistoryScreen({ navigate, initialFilter }: Props) {
  return (
    <ScreenContainer>
      <ScreenTitle title="Movimientos" subtitle="Consulta todas tus ventas y gastos registrados." />

      <MovementList
        initialTypeFilter={initialFilter}
        onAddPress={() => navigate?.('NUEVO_MOVIMIENTO')}
      />
    </ScreenContainer>
  );
}
