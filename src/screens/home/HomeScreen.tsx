import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppButton, AppText, Icon, IconBox } from '../../atoms';
import {
  BrandHeader,
  HomeStatsCard,
  QuickActionsGrid,
  ScreenContainer,
} from '../../molecules';
import { HomeBalanceHero, MetricsCarousel } from '../../organisms';
import { useAuth, useJornada } from '../../hooks';
import { NavigateFn } from '../../types';
import { calculateFinancialSummary } from '../../services';

interface Props {
  navigate: NavigateFn;
}

export function HomeScreen({ navigate }: Props) {
  const { balance, movimientos, allMovimientos, jornadaActual } = useJornada();
  const { user } = useAuth();

  const isBoxOpen = Boolean(jornadaActual && jornadaActual.estado === 'ABIERTA');
  const greeting = user.name?.trim() ? `Hola, ${user.name.trim()}` : 'Bienvenido';

  const dateTitle = useMemo(() => {
    const today = new Date();
    try {
      const formatted = today.toLocaleDateString('es-PE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return 'Hoy';
    }
  }, []);

  // Calcular métricas destacadas dinámicamente con los datos locales reales
  const metrics = useMemo(() => {
    const dataPool = allMovimientos.length > 0 ? allMovimientos : movimientos;
    return calculateFinancialSummary(dataPool).metrics;
  }, [allMovimientos, movimientos]);

  return (
    <ScreenContainer>
      {/* Franja magenta con degradado: header + saludo + saldo */}
      <LinearGradient
        colors={[Colors.brand, Colors.brandDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.heroPanel}
      >
        <BrandHeader tone="brand" />
        <HomeBalanceHero
          balance={balance}
          greeting={greeting}
          dateTitle={dateTitle}
          isOpen={isBoxOpen}
          avatarUri={user.avatarUri}
          userName={user.name}
        />
      </LinearGradient>

      {isBoxOpen ? (
        <>
          {/* Ingresos / Gastos: tarjeta blanca flotante sobre el borde de la franja */}
          <HomeStatsCard
            balance={balance}
            movementsCount={movimientos.length}
            style={styles.floatingStats}
            onPressIncome={() =>
              navigate('MOVIMIENTOS', { filtroInicial: 'INGRESOS', filtroTipo: 'INGRESO' })
            }
            onPressExpense={() =>
              navigate('MOVIMIENTOS', { filtroInicial: 'GASTOS', filtroTipo: 'EGRESO' })
            }
            onSeeAll={() =>
              navigate('MOVIMIENTOS', { filtroInicial: 'TODOS', filtroTipo: 'TODOS' })
            }
          />

          {/* Acceso rápido a registrar: Ingreso y Gasto */}
          <QuickActionsGrid onSelect={tipo => navigate('NUEVO_MOVIMIENTO', { movimientoTipo: tipo })} />

          {/* Carrusel de métricas destacadas reales en sustitución de últimos movimientos */}
          <MetricsCarousel metrics={metrics} onPressDetails={() => navigate('RESUMEN')} />

          {/* Cierre de jornada al final para evitar pulsarlo por accidente */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar jornada"
            onPress={() => navigate('CERRAR_JORNADA')}
            style={({ pressed }) => [styles.closeDayButton, { opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={styles.closeDayIconWrap}>
              <Icon name="logout" color={Colors.red} size={16} />
            </View>
            <View style={styles.closeDayCopy}>
              <AppText style={styles.closeDayTitle}>Cerrar jornada</AppText>
              <AppText style={styles.closeDaySubtitle}>Arqueo y sellado de la caja</AppText>
            </View>
            <Icon name="chevron" color={Colors.red} size={14} />
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.closedNotice}>
            <IconBox
              name="info"
              color={Colors.text}
              backgroundColor={Colors.neutralSoft}
              size={40}
              iconSize={20}
              shape="card"
            />
            <View style={styles.closedCopy}>
              <AppText style={styles.closedTitle}>Aún no abres tu caja</AppText>
              <AppText style={styles.closedSubtitle}>
                Ábrela para registrar tus ventas y gastos del día.
              </AppText>
            </View>
          </View>

          <AppButton
            label="Abrir caja del día"
            tone="magenta"
            onPress={() => navigate('ABRIR_JORNADA')}
            iconName="wallet"
            showChevron
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroPanel: {
    // Degradado magenta → vino (colors del LinearGradient)
    ...Radius.heroBottom,
    // Franja a sangre: toca borde superior y laterales, redondeo solo inferior.
    marginHorizontal: -Spacing.md,
    marginTop: -Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    marginBottom: 0,
    ...Shadows.hero,
  },
  floatingStats: {
    marginTop: -Spacing.xl,
    marginBottom: Spacing.md,
  },
  closeDayButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  closeDayIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.redLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeDayCopy: {
    flex: 1,
  },
  closeDayTitle: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.danger,
  },
  closeDaySubtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    marginTop: 1,
  },
  closedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.neutralSoft,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  closedCopy: {
    flex: 1,
  },
  closedTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  closedSubtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    marginTop: 2,
  },
});
