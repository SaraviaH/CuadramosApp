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
  initialType?: TipoMovimiento;
}

const CATEGORIES: Record<TipoMovimiento, readonly string[]> = {
  INGRESO: ['Venta del día', 'Cobro de cliente', 'Servicio', 'Otros ingresos'],
  EGRESO: ['Compra de insumos', 'Pago de servicios', 'Transporte', 'Alquiler', 'Otros gastos'],
  RETIRO: ['Retiro personal', 'Entrega a socio', 'Traslado de fondos'],
};

const PAYMENT_METHODS: readonly MetodoPago[] = [
  'Efectivo',
  'Yape',
  'Plin',
  'Transferencia bancaria',
  'Tarjeta',
];

const TYPE_OPTIONS: readonly TipoMovimiento[] = ['INGRESO', 'EGRESO'];
const TYPE_LABELS = ['Ingreso / Venta', 'Gasto'];

const TYPE_OPTIONS_WITH_RETIRO: readonly TipoMovimiento[] = ['INGRESO', 'EGRESO', 'RETIRO'];
const TYPE_LABELS_WITH_RETIRO = ['Ingreso / Venta', 'Gasto', 'Retiro'];

export function MovementForm({ onSubmit, loading = false, initialType }: Props) {
  const allowRetiro = initialType === 'RETIRO';
  const initialTipo = allowRetiro ? 'RETIRO' : initialType === 'EGRESO' ? 'EGRESO' : 'INGRESO';
  const [tipo, setTipo] = useState<TipoMovimiento>(initialTipo);
  const [categoria, setCategoria] = useState<string>(CATEGORIES[initialTipo][0]);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('Efectivo');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | undefined>();

  const tone: 'green' | 'red' | 'magenta' =
    tipo === 'INGRESO' ? 'green' : tipo === 'EGRESO' ? 'red' : 'magenta';
  const typeOptions = allowRetiro ? TYPE_OPTIONS_WITH_RETIRO : TYPE_OPTIONS;
  const typeLabels = allowRetiro ? TYPE_LABELS_WITH_RETIRO : TYPE_LABELS;

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
        options={typeOptions}
        labels={typeLabels}
        selected={tipo}
        onSelect={handleTypeChange}
        tone={tone}
        size="lg"
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
        placeholder="Ej. Cobro por venta o factura de compra"
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
