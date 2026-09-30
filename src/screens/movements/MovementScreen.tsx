import React from 'react';
import { useJornada } from '../../hooks';
import { MovementForm, ScreenLayout } from '../../organisms';
import { Ruta } from '../../types';

interface Props {
  goBack: () => void;
  navigate: (route: Ruta) => void;
}

export function MovementScreen({ goBack }: Props) {
  const { addMovement, notification, dismissNotification } = useJornada();

  return (
    <ScreenLayout
      title="Nuevo movimiento"
      subtitle="Los ingresos suman a tu caja; los egresos y retiros descuentan del saldo disponible."
      onBack={goBack}
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      <MovementForm onSubmit={addMovement} />
    </ScreenLayout>
  );
}

