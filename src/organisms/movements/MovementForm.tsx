import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing, Surfaces } from '../../theme';
import { AppButton, AppInput } from '../../atoms';
import { ChipSelector, SegmentedControl } from '../../molecules';
import { MetodoPago, TipoMovimiento } from '../../types';

interface Props {
  onSubmit: (data: {
    tipo: TipoMovimiento;
    monto: number;
    concepto: string;
    categoria: string;
    metodoPago: MetodoPago;
    descripcion: string;
  }) => Promise<void>;
  loading?: boolean;
}

const CATEGORIES: Record<TipoMovimiento, readonly string[]> = {
  INGRESO: ['Venta del día', 'Cobro de cliente', 'Otros ingresos'],
  EGRESO: ['Compra de insumos', 'Servicios', 'Transporte', 'Otros gastos'],
  RETIRO: ['Retiro personal', 'Entrega a socio', 'Traslado de fondos'],
};

const PAYMENT_METHODS: readonly MetodoPago[] = [
  'Efectivo',
  'Yape',
  'Plin',
  'Transferencia bancaria',
  'Tarjeta',
];

const TYPE_OPTIONS: readonly TipoMovimiento[] = ['INGRESO', 'EGRESO', 'RETIRO'];

const getFriendlyTodayString = () => {
  const d = new Date();
  const formatted = d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });
  return `Hoy, ${formatted}`;
};

export function MovementForm({ onSubmit, loading = false }: Props) {
  const [tipo, setTipo] = useState<TipoMovimiento>('INGRESO');
  const [categoria, setCategoria] = useState<string>(CATEGORIES.INGRESO[0]);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('Efectivo');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(getFriendlyTodayString);
  const [error, setError] = useState<string | undefined>();

  const tone = tipo === 'INGRESO' ? 'green' : tipo === 'EGRESO' ? 'red' : 'orange';

  const handleTypeChange = (next: TipoMovimiento) => {
    setTipo(next);
    setCategoria(CATEGORIES[next][0]);
  };

  const handleSave = async () => {
    const parsed = parseFloat(monto);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Ingresa un monto mayor a cero.');
      return;
    }
    setError(undefined);

    await onSubmit({
      tipo,
      monto: parsed,
      concepto: categoria,
      categoria,
      metodoPago,
      descripcion: descripcion.trim() || categoria,
    });
  };

  return (
    <View style={styles.card}>
      <SegmentedControl
        options={TYPE_OPTIONS}
        selected={tipo}
        onSelect={handleTypeChange}
        tone={tone}
      />

      <AppInput
        label="Monto"
        prefix="S/"
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={monto}
        onChangeText={val => {
          setMonto(val);
          if (error) setError(undefined);
        }}
        error={error}
      />

      <ChipSelector
        label="Categoría"
        items={CATEGORIES[tipo]}
        selected={categoria}
        onSelect={setCategoria}
        tone={tone}
      />

      <ChipSelector
        label="Método de pago"
        items={PAYMENT_METHODS}
        selected={metodoPago}
        onSelect={setMetodoPago}
        tone={tone}
      />

      <AppInput
        label="Descripción (opcional)"
        icon="note"
        placeholder="Ej. Venta de almuerzo"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <AppButton
        label={`Guardar ${tipo === 'INGRESO' ? 'ingreso' : tipo === 'EGRESO' ? 'gasto' : 'retiro'}`}
        tone={tone}
        loading={loading}
        onPress={handleSave}
        style={{ marginTop: Spacing.xs }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Surfaces.card,
    padding: Spacing.md,
    gap: Spacing.md,
  },
});
