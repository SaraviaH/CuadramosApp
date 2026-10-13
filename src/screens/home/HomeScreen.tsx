import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppButton, AppText, Icon, IconBox } from '../../atoms';
import {
  BrandHeader,
  QuickActionsGrid,
  RecentMovementsCard,
  ScreenContainer,
} from '../../molecules';
import { HomeBalanceHero } from '../../organisms';
import { useAuth, useJornada } from '../../hooks';
import { Ruta } from '../../types';

interface Props {
  navigate: (route: Ruta) => void;
}

export function HomeScreen({ navigate }: Props) {
  const { balance, movimientos, jornadaActual } = useJornada();
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

  return (
    <ScreenContainer>
      {/* Franja magenta continua: header + resumen del saldo */}
      <View style={styles.heroPanel}>
        <BrandHeader tone="brand" />
        <HomeBalanceHero
          balance={balance}
          greeting={greeting}
          dateTitle={dateTitle}
          isOpen={isBoxOpen}
          movementsCount={movimientos.length}
        />
      </View>

      {isBoxOpen ? (
        <>
          {/* Acceso rápido a registrar por tipo */}
          <QuickActionsGrid onSelect={() => navigate('NUEVO_MOVIMIENTO')} />

          {/* Últimos movimientos del día activo */}
          <RecentMovementsCard
            movements={movimientos}
            onSeeAll={() => navigate('MOVIMIENTOS')}
          />

          {/* Cierre de jornada al final para evitar pulsarlo por accidente */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar jornada"
            onPress={() => navigate('CERRAR_JORNADA')}
            style={({ pressed }) => [styles.closeDayButton, { opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={styles.closeDayIconWrap}>
              <Icon name="logout" color={Colors.red} size={18} />
            </View>
            <View style={styles.closeDayCopy}>
              <AppText style={styles.closeDayTitle}>Cerrar jornada</AppText>
              <AppText style={styles.closeDaySubtitle}>Arqueo y sellado de la caja del día</AppText>
            </View>
            <Icon name="chevron" color={Colors.red} size={16} />
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.closedNotice}>
            <IconBox
              name="info"
              color={Colors.muted}
              backgroundColor={Colors.neutralSoft}
              size={40}
              iconSize={20}
              shape="card"
            />
            <View style={styles.closedCopy}>
              <AppText style={styles.closedTitle}>Aún no abres tu caja</AppText>
              <AppText style={styles.closedSubtitle}>
                Ábrela para registrar tus ventas, gastos y retiros del día.
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
    backgroundColor: Colors.brand,
    ...Radius.heroBottom,
    // Franja a sangre: toca borde superior y laterales, redondeo solo inferior.
    marginHorizontal: -Spacing.md,
    marginTop: -Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.hero,
  },
  closeDayButton: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    ...Radius.asymmetricCard,
    paddingHorizontal: Spacing.md,
  },
  closeDayIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeDayCopy: {
    flex: 1,
  },
  closeDayTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '800',
    color: Colors.danger,
  },
  closeDaySubtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
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
    color: Colors.muted,
    marginTop: 2,
  },
});
