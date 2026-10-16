import React from 'react';
import { InfoTip, ScreenContainer, ScreenTitle } from '../../molecules';
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
      <ScreenTitle
        title="Movimientos"
        right={
          <InfoTip
            accessibilityLabel="Información sobre Movimientos"
            text="Consulta todos tus ingresos y gastos registrados."
          />
        }
      />

      <MovementList
        initialTypeFilter={initialFilter}
        onAddPress={() => navigate?.('NUEVO_MOVIMIENTO')}
      />
    </ScreenContainer>
  );
}
