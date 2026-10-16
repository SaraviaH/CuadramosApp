import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView } from 'react-native';
import { BackButton, ScreenContainer, ScreenTitle } from '../../molecules';
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
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const descriptionFocused = useRef(false);

  // Al abrir el teclado con la Descripción enfocada, bajamos hasta el final para
  // que también quede visible el botón "Guardar".
  const keyboardVisible = useRef(false);
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      keyboardVisible.current = true;
      if (descriptionFocused.current) {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      keyboardVisible.current = false;
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
      setTimeout(() => {
        navigate('MOVIMIENTOS');
      }, 700);
    } catch {
      // Notificado vía contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer ref={scrollRef} keyboardShouldPersistTaps="handled">
      <ScreenTitle left={<BackButton onPress={goBack} />} title="Nuevo movimiento" />

      <MovementForm
        onSubmit={handleSubmit}
        loading={loading}
        initialType={initialType}
        onDescriptionFocus={() => {
          descriptionFocused.current = true;
          // Si el teclado ya estaba abierto, `keyboardDidShow` no se vuelve a
          // emitir, así que desplazamos aquí también.
          if (keyboardVisible.current) {
            scrollRef.current?.scrollToEnd({ animated: true });
          }
        }}
        onDescriptionBlur={() => {
          descriptionFocused.current = false;
        }}
      />
    </ScreenContainer>
  );
}
