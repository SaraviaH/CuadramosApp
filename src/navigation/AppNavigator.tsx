import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJornada } from '../hooks';
import { Colors } from '../theme';
import { Ruta, TabPrincipal } from '../types';
import {
  BalanceScreen,
  BoxHistoryScreen,
  CloseDayScreen,
  DemoToolsScreen,
  HomeScreen,
  LoadingScreen,
  LoginScreen,
  MoreScreen,
  MovementHistoryScreen,
  MovementScreen,
  OpenDayScreen,
  RegisterScreen,
  SettingsScreen,
} from '../screens';
import { BottomNav } from '../molecules';

const TAB_ROUTES: TabPrincipal[] = ['INICIO', 'MOVIMIENTOS', 'RESUMEN', 'MAS'];

export function AppNavigator() {
  const { isLoading, jornadaActual } = useJornada();
  const [route, setRoute] = useState<Ruta>('INICIO');
  const history = useRef<Ruta[]>([]);

  useEffect(() => {
    if (isLoading) return;
    if (!jornadaActual) {
      history.current = [];
      setRoute('ABRIR_JORNADA');
    } else if (route === 'ABRIR_JORNADA') {
      setRoute('INICIO');
    }
  }, [isLoading, jornadaActual, route]);

  const navigate = useCallback((nextRoute: Ruta) => {
    setRoute(current => {
      if (current !== nextRoute) {
        history.current.push(current);
      }
      return nextRoute;
    });
  }, []);

  const goBack = useCallback(() => {
    setRoute(history.current.pop() ?? 'INICIO');
  }, []);

  if (isLoading) return <LoadingScreen />;

  let screen: React.ReactNode;
  switch (route) {
    case 'ABRIR_JORNADA':
      screen = <OpenDayScreen />;
      break;
    case 'NUEVO_MOVIMIENTO':
    case 'MOVIMIENTO':
      screen = <MovementScreen goBack={goBack} navigate={navigate} />;
      break;
    case 'MOVIMIENTOS':
    case 'HISTORIAL':
      screen = <MovementHistoryScreen navigate={navigate} goBack={goBack} />;
      break;
    case 'RESUMEN':
    case 'BALANCE':
      screen = <BalanceScreen goBack={goBack} />;
      break;
    case 'MAS':
      screen = <MoreScreen navigate={navigate} />;
      break;
    case 'CERRAR_JORNADA':
      screen = <CloseDayScreen goBack={goBack} />;
      break;
    case 'SIMULADOR':
    case 'DEMO':
      screen = <DemoToolsScreen goBack={goBack} />;
      break;
    case 'HISTORIAL_CAJAS':
      screen = <BoxHistoryScreen goBack={goBack} />;
      break;
    case 'LOGIN':
      screen = <LoginScreen navigate={navigate} />;
      break;
    case 'REGISTRO':
      screen = <RegisterScreen navigate={navigate} />;
      break;
    case 'CONFIGURACION':
      screen = <SettingsScreen goBack={goBack} navigate={navigate} />;
      break;
    case 'INICIO':
    default:
      screen = <HomeScreen navigate={navigate} />;
      break;
  }

  const isTabActive = TAB_ROUTES.includes(route as TabPrincipal);
  const activeTab: TabPrincipal = (
    route === 'MOVIMIENTO' || route === 'HISTORIAL'
      ? 'MOVIMIENTOS'
      : route === 'BALANCE'
      ? 'RESUMEN'
      : route === 'CONFIGURACION'
      ? 'MAS'
      : isTabActive
      ? (route as TabPrincipal)
      : 'INICIO'
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.contentWrap}>{screen}</View>
      {isTabActive && jornadaActual && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={tab => navigate(tab)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentWrap: {
    flex: 1,
  },
});
