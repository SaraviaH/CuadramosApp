import React from 'react';
import { AppText } from '../../atoms';
import { useJornada } from '../../hooks';
import { HomeSummary, ScreenLayout } from '../../organisms';
import { Ruta } from '../../types';

interface Props {
  navigate: (route: Ruta) => void;
}

export function HomeScreen({ navigate }: Props) {
  const {
    jornadaActual,
    balance,
    movimientos,
    eventosPendientes,
    notification,
    dismissNotification,
  } = useJornada();

  if (!jornadaActual || !balance) {
    return (
      <ScreenLayout title="Inicio">
        <AppText>No hay una jornada activa.</AppText>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="Caja del día"
      subtitle="Supervisa tus ingresos, gastos y arqueo en tiempo real."
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      <HomeSummary
        jornada={jornadaActual}
        balance={balance}
        pendingCount={eventosPendientes.length}
        movementCount={movimientos.length}
        onMovement={() => navigate('MOVIMIENTO')}
        onBalance={() => navigate('BALANCE')}
        onHistory={() => navigate('HISTORIAL')}
        onClose={() => navigate('CERRAR_JORNADA')}
        onSettings={() => navigate('CONFIGURACION')}
        onPayments={() => navigate('DEMO')}
      />
    </ScreenLayout>
  );
}

