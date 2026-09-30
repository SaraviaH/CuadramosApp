import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJornada } from '../hooks';
import { Colors } from '../theme';
import { Ruta } from '../types';
import { BalanceScreen, CloseDayScreen, DemoToolsScreen, HomeScreen, LoadingScreen, MovementHistoryScreen, MovementScreen, OpenDayScreen, SettingsScreen } from '../screens';

export function AppNavigator() {
  const { isLoading, jornadaActual } = useJornada();
  const [route, setRoute] = useState<Ruta>('INICIO');
  const history = useRef<Ruta[]>([]);

  useEffect(() => {
    if (isLoading) return;
    if (!jornadaActual) { history.current = []; setRoute('ABRIR_JORNADA'); }
    else if (route === 'ABRIR_JORNADA') setRoute('INICIO');
  }, [isLoading, jornadaActual, route]);

  const navigate = useCallback((nextRoute: Ruta) => {
    setRoute(current => { if (current !== nextRoute) history.current.push(current); return nextRoute; });
  }, []);
  const goBack = useCallback(() => setRoute(history.current.pop() ?? 'INICIO'), []);

  if (isLoading) return <LoadingScreen />;
  let screen: React.ReactNode;
  switch (route) {
    case 'ABRIR_JORNADA': screen = <OpenDayScreen />; break;
    case 'MOVIMIENTO': screen = <MovementScreen goBack={goBack} navigate={navigate} />; break;
    case 'BALANCE': screen = <BalanceScreen goBack={goBack} />; break;
    case 'HISTORIAL': screen = <MovementHistoryScreen goBack={goBack} />; break;
    case 'CERRAR_JORNADA': screen = <CloseDayScreen goBack={goBack} />; break;
    case 'CONFIGURACION': screen = <SettingsScreen goBack={goBack} navigate={navigate} />; break;
    case 'DEMO': screen = <DemoToolsScreen goBack={goBack} />; break;
    case 'INICIO': default: screen = <HomeScreen navigate={navigate} />;
  }
  return <SafeAreaView edges={['top']} style={styles.container}>{screen}</SafeAreaView>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.background } });
