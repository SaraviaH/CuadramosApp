import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '../../theme';
import { AlertCard, BrandHeader, ScreenTitle } from '../../molecules';
import { MovementForm } from '../../organisms';
import { useJornada } from '../../hooks';
import { MetodoPago, Ruta, TipoMovimiento } from '../../types';

interface Props {
  goBack: () => void;
  navigate: (route: Ruta) => void;
}

export function MovementScreen({ goBack, navigate }: Props) {
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
    fecha: string;
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
        data.fecha,
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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <BrandHeader back onBack={goBack} />

      {saved && (
        <AlertCard tone="success" icon="check" title="Movimiento registrado">
          Tu caja se actualizó correctamente.
        </AlertCard>
      )}

      <ScreenTitle title="Nuevo movimiento" />

      <MovementForm onSubmit={handleSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
