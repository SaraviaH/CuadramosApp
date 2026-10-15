import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing, Surfaces } from '../../theme';
import { AmountField, AppButton, AppInput } from '../../atoms';
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
  initialType?: TipoMovimiento;
}

const CATEGORIES: Record<TipoMovimiento, readonly string[]> = {
  INGRESO: ['Venta del día', 'Cobro de cliente', 'Servicio', 'Otros ingresos'],
  EGRESO: ['Compra de insumos', 'Pago de servicios', 'Transporte', 'Alquiler', 'Otros gastos'],
};

const PAYMENT_METHODS: readonly MetodoPago[] = [
  'Efectivo',
  'Yape',
  'Plin',
  'Transferencia bancaria',
  'Tarjeta',
];

const TYPE_OPTIONS: readonly TipoMovimiento[] = ['INGRESO', 'EGRESO'];
const TYPE_LABELS = ['Ingreso', 'Gasto'];

export function MovementForm({ onSubmit, loading = false, initialType }: Props) {
  const initialTipo = initialType === 'EGRESO' ? 'EGRESO' : 'INGRESO';
  const [tipo, setTipo] = useState<TipoMovimiento>(initialTipo);
  const [categoria, setCategoria] = useState<string>(CATEGORIES[initialTipo][0]);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('Efectivo');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleTypeChange = (next: TipoMovimiento) => {
    setTipo(next);
    setCategoria(CATEGORIES[next][0]);
  };

  const handleSave = async () => {
    const cleanMonto = monto.replace(',', '.').trim();
    const parsed = parseFloat(cleanMonto);
    if (!cleanMonto || isNaN(parsed) || parsed <= 0) {
      setError('Ingresa un monto válido mayor a cero.');
      return;
    }

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
        labels={TYPE_LABELS}
        selected={tipo}
        onSelect={handleTypeChange}
        tone="magenta"
        size="lg"
      />

      <AmountField
        label="Monto"
        accessibilityLabel="Monto en soles"
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
        tone="magenta"
      />

      <ChipSelector
        label="Método de pago"
        items={PAYMENT_METHODS}
        selected={metodoPago}
        onSelect={setMetodoPago}
        tone="magenta"
      />

      <AppInput
        label="Descripción (opcional)"
        icon="note"
        placeholder="Ej. Cobro por venta o factura de compra"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <AppButton
        label={`Guardar ${tipo === 'INGRESO' ? 'ingreso' : 'gasto'}`}
        tone="magenta"
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
