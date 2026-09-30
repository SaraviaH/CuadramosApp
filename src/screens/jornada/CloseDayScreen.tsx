import React, { useState } from 'react';
import { AppText, Card } from '../../atoms';
import { useJornada } from '../../hooks';
import { CloseDayPanel, ScreenLayout } from '../../organisms';
import { Colors } from '../../theme';

interface Props {
  goBack: () => void;
}

export function CloseDayScreen({ goBack }: Props) {
  const { balance, eventosPendientes, closeDay, notification, dismissNotification } = useJornada();
  const [busy, setBusy] = useState(false);

  const close = async () => {
    setBusy(true);
    try {
      await closeDay();
    } catch {
      // El contexto reporta el mensaje en la notificación superior
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenLayout
      title="Cierre de jornada"
      subtitle="Arqueo final y cuadre de caja. Verifica que todo coincida antes de cerrar el turno."
      onBack={goBack}
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      {balance ? (
        <CloseDayPanel
          balance={balance}
          pendingCount={eventosPendientes.length}
          onClose={close}
          loading={busy}
        />
      ) : (
        <Card>
          <AppText color={Colors.textMuted}>No hay una jornada activa.</AppText>
        </Card>
      )}
    </ScreenLayout>
  );
}

