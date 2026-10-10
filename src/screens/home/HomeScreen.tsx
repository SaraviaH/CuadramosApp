import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppText, Icon } from '../../atoms';
import { BrandHeader } from '../../molecules';
import { HomeBalanceHero } from '../../organisms';
import { useAuth, useJornada } from '../../hooks';
import { Ruta } from '../../types';

interface Props {
  navigate: (route: Ruta) => void;
}

export function HomeScreen({ navigate }: Props) {
  const { balance, movimientos } = useJornada();
  const { user } = useAuth();

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
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <BrandHeader />

      {/* Saludo y Fecha */}
      <View style={styles.greetingWrap}>
        <View style={styles.greetingPill}>
          <AppText style={styles.greetingText}>{greeting}</AppText>
        </View>
        <AppText style={styles.dateTitle}>{dateTitle}</AppText>
      </View>

      {/* Saldo disponible en caja */}
      <HomeBalanceHero balance={balance} />

      {/* Estado actual de la caja */}
      <View style={styles.statusPill}>
        <View style={styles.statusPillLeft}>
          <Icon name="check" color={Colors.green} size={16} />
          <AppText style={styles.statusPillText}>Caja al día</AppText>
        </View>
        <AppText style={styles.statusPillCount}>
          {movimientos.length === 1 ? '1 movimiento hoy' : `${movimientos.length} movimientos hoy`}
        </AppText>
      </View>

      {/* Botón principal de registro de movimiento */}
      <AppButton
        label="Registrar movimiento"
        tone="magenta"
        onPress={() => navigate('NUEVO_MOVIMIENTO')}
        iconName="plus"
        showChevron
      />

      {/* Resumen real del día sin cifras ficticias */}
      {hasActivity ? (
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
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
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
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  dateTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: Colors.ink,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#0D704D',
  },
  statusPillCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D704D',
    opacity: 0.85,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E8F9F1',
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#BCE5D3',
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
    fontSize: 9,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 0.8,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ink,
    marginTop: 2,
  },
});
