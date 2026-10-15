import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJornada } from '../hooks';
import { Colors } from '../theme';
import { Ruta, TabPrincipal, NavigationParams } from '../types';
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
  WelcomeScreen,
} from '../screens';
import { BottomNav } from '../molecules';
import { FloatingActionButton } from '../atoms';
import { NotificationBanner } from '../organisms';
import { hasSeenWelcome } from '../storage/repositories/userSessionRepository';

const TAB_ROUTES: TabPrincipal[] = ['INICIO', 'MOVIMIENTOS', 'RESUMEN', 'MAS'];
const MAS_FLOW: Ruta[] = [
  'SIMULADOR',
  'DEMO',
  'CERRAR_JORNADA',
  'HISTORIAL_CAJAS',
  'LOGIN',
  'REGISTRO',
  'CONFIGURACION',
];

export function AppNavigator() {
  const { isLoading, jornadaActual } = useJornada();
  const [route, setRoute] = useState<Ruta>('INICIO');
  const [params, setParams] = useState<NavigationParams>({});
  const history = useRef<Ruta[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      hasSeenWelcome().then(seen => {
        if (!seen && !jornadaActual) {
          setRoute('BIENVENIDA');
        } else {
          setRoute('INICIO');
        }
      });
      return;
    }

    if (jornadaActual && route === 'ABRIR_JORNADA') {
      setRoute('INICIO');
    }
  }, [isLoading, jornadaActual, route]);

  const navigate = useCallback((nextRoute: Ruta, nextParams?: NavigationParams) => {
    setParams(nextParams ?? {});
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
    case 'BIENVENIDA':
      screen = <WelcomeScreen navigate={navigate} />;
      break;
    case 'ABRIR_JORNADA':
      screen = <OpenDayScreen goBack={goBack} />;
      break;
    case 'NUEVO_MOVIMIENTO':
    case 'MOVIMIENTO':
      screen = (
        <MovementScreen
          goBack={goBack}
          navigate={navigate}
          initialType={params.movimientoTipo}
        />
      );
      break;
    case 'MOVIMIENTOS':
    case 'HISTORIAL':
      screen = (
        <MovementHistoryScreen
          navigate={navigate}
          goBack={goBack}
          initialFilter={params.filtroInicial ?? params.filtroTipo}
        />
      );
      break;
    case 'RESUMEN':
    case 'BALANCE':
      screen = <BalanceScreen navigate={navigate} />;
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
      : MAS_FLOW.includes(route)
      ? 'MAS'
      : isTabActive
      ? (route as TabPrincipal)
      : 'INICIO'
  );

  const hasBottomNav = route !== 'ABRIR_JORNADA' && route !== 'BIENVENIDA';

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.contentWrap}>
        {screen}
      </View>
      {hasBottomNav && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={tab => navigate(tab)}
        />
      )}
      {isTabActive && route !== 'INICIO' && (
        <FloatingActionButton onPress={() => navigate('NUEVO_MOVIMIENTO')} />
      )}
      <NotificationBanner hasBottomNav={hasBottomNav} />
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
