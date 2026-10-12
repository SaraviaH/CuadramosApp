import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { BrandHeader, ScreenContainer } from '../../molecules';
import { HomeBalanceHero } from '../../organisms';
import { useAuth, useJornada } from '../../hooks';

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

  const hasActivity = balance && (balance.ingresos > 0 || balance.egresos > 0 || balance.retiros > 0);

  return (
    <ScreenContainer>
      <BrandHeader />

      {/* Saludo y Fecha */}
      <View style={styles.greetingWrap}>
        <View style={styles.greetingPill}>
          <AppText style={styles.greetingText}>{greeting}</AppText>
        </View>
        <AppText style={styles.dateTitle}>{dateTitle}</AppText>
      </View>

      {/* Saldo disponible en caja */}
      <HomeBalanceHero balance={balance} isOpen={isBoxOpen} />

      {/* Estado actual de la caja */}
      {isBoxOpen ? (
        <View style={styles.statusPill}>
          <View style={styles.statusPillLeft}>
            <Icon name="check" color={Colors.green} size={16} />
            <AppText style={styles.statusPillText}>Caja al día</AppText>
          </View>
          <AppText style={styles.statusPillCount}>
            {movimientos.length === 1 ? '1 movimiento hoy' : `${movimientos.length} movimientos hoy`}
          </AppText>
        </View>
      ) : (
        <View style={[styles.statusPill, styles.statusPillClosed]}>
          <View style={styles.statusPillLeft}>
            <Icon name="clock" color="#55555C" size={16} />
            <AppText style={styles.statusPillClosedText}>Caja cerrada</AppText>
          </View>
          <AppText style={styles.statusPillClosedSub}>
            Inicia una jornada para registrar ventas
          </AppText>
        </View>
      )}

      {/* Acciones principales de caja */}
      {isBoxOpen ? (
        <>
          <AppButton
            label="Registrar movimiento"
            tone="magenta"
            onPress={() => navigate('NUEVO_MOVIMIENTO')}
            iconName="plus"
            showChevron
          />

          {/* Botón Cerrar jornada - Visible en Inicio mientras la caja está abierta */}
          <Pressable
            accessibilityRole="button"
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
        <AppButton
          label="Abrir caja del día"
          tone="magenta"
          onPress={() => navigate('ABRIR_JORNADA')}
          iconName="wallet"
          showChevron
        />
      )}

      {/* Resumen real del día sin cifras ficticias */}
      {isBoxOpen ? (
        hasActivity ? (
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Icon name="chart" color={Colors.green} size={20} />
            </View>
            <View style={styles.insightCopy}>
              <AppText style={styles.insightEyebrow}>ACTIVIDAD DEL DÍA</AppText>
              <AppText style={styles.insightTitle}>
                {`Ingresos: S/ ${(balance?.ingresos ?? 0).toFixed(2)} · Gastos: S/ ${(balance?.egresos ?? 0).toFixed(2)}`}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Icon name="wallet" color={Colors.brand} size={20} />
            </View>
            <View style={styles.insightCopy}>
              <AppText style={styles.insightEyebrow}>CAJA ABIERTA</AppText>
              <AppText style={styles.insightTitle}>
                {`Saldo inicial registrado: S/ ${(balance?.saldoInicial ?? 0).toFixed(2)}`}
              </AppText>
            </View>
          </View>
        )
      ) : (
        <View style={[styles.insightCard, styles.insightCardClosed]}>
          <View style={styles.insightIcon}>
            <Icon name="wallet" color={Colors.muted} size={20} />
          </View>
          <View style={styles.insightCopy}>
            <AppText style={[styles.insightEyebrow, { color: Colors.muted }]}>SIN CAJA ABIERTA</AppText>
            <AppText style={styles.insightTitle}>
              Abre tu caja del día para registrar ventas, gastos y retiros.
            </AppText>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  greetingWrap: {
    marginBottom: Spacing.md,
    gap: 4,
  },
  greetingPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...Radius.asymmetricChip,
  },
  greetingText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  dateTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statusPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginVertical: Spacing.sm,
  },
  statusPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPillText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.success,
  },
  statusPillCount: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.success,
    opacity: 0.85,
  },
  statusPillClosed: {
    backgroundColor: '#F0F0F3',
  },
  statusPillClosedText: {
    color: '#55555C',
  },
  statusPillClosedSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
  },
  closeDayButton: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: '#F3C1C1',
    ...Radius.asymmetricCard,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
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
    fontSize: 13,
    fontWeight: '800',
    color: '#9F3030',
  },
  closeDaySubtitle: {
    fontSize: 10,
    color: '#AF6161',
    marginTop: 1,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.greenLight,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#BCE5D3',
  },
  insightCardClosed: {
    backgroundColor: '#F8F8FA',
    borderColor: '#E4E4E7',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  insightCopy: {
    flex: 1,
  },
  insightEyebrow: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 0.8,
  },
  insightTitle: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
});
