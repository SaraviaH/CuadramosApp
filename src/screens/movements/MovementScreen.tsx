import React, { useState } from 'react';
import { AlertCard, BrandHeader, ScreenContainer, ScreenTitle } from '../../molecules';
import { MovementForm } from '../../organisms';
import { useJornada } from '../../hooks';
import { MetodoPago, Ruta, TipoMovimiento } from '../../types';

interface Props {
  goBack: () => void;
  navigate: (route: Ruta) => void;
  initialType?: TipoMovimiento;
}

export function MovementScreen({ goBack, navigate, initialType }: Props) {
  const { addMovement } = useJornada();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    tipo: TipoMovimiento;
    monto: number;
    concepto: string;
    categoria: string;
    metodoPago: MetodoPago;
    descripcion: string;
  }) => {
    setLoading(true);
    try {
      await addMovement(
        data.tipo,
        data.monto,
        data.concepto,
        data.categoria,
        data.metodoPago,
        data.descripcion,
      );
      setSaved(true);
      setTimeout(() => {
        navigate('MOVIMIENTOS');
      }, 700);
    } catch {
      // Notified via context
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer keyboardShouldPersistTaps="handled">
      <BrandHeader back onBack={goBack} variant="compact-left" />

      {saved && (
        <AlertCard tone="success" icon="check" title="Movimiento registrado">
          Tu caja se actualizó correctamente.
        </AlertCard>
      )}

      <ScreenTitle title="Nuevo movimiento" />

      <MovementForm onSubmit={handleSubmit} loading={loading} initialType={initialType} />
    </ScreenContainer>
  );
}
