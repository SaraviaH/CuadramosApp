import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppText, Card } from '../../atoms';
import { Balance, Jornada } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';
import { QuickActionCard } from '../../molecules';
import { JornadaHero } from './JornadaHero';

interface Props {
  jornada: Jornada;
  balance: Balance;
  pendingCount: number;
  movementCount: number;
  onMovement: () => void;
  onBalance: () => void;
  onHistory: () => void;
  onClose: () => void;
  onSettings: () => void;
  onPayments: () => void;
}

export function HomeSummary({
  jornada,
  balance,
  pendingCount,
  movementCount,
  onMovement,
  onBalance,
  onHistory,
  onClose,
  onSettings,
  onPayments,
}: Props) {
  const hasPending = pendingCount > 0;

  const guideConfig = hasPending
    ? {
        badge: 'ACCIÓN REQUERIDA',
        title: `Tienes ${pendingCount} pago${pendingCount > 1 ? 's' : ''} pendiente${pendingCount > 1 ? 's' : ''}`,
        description: 'Debes confirmarlos o cancelarlos antes de poder cerrar tu jornada.',
        icon: '!',
        color: Colors.warning,
        bg: Colors.warningSoft,
        borderColor: 'rgba(183, 121, 31, 0.35)',
        buttonLabel: 'Resolver pagos',
        buttonAction: onPayments,
      }
    : movementCount === 0
    ? {
        badge: 'PRIMER PASO',
        title: 'Caja lista para operar',
        description: 'Registra un ingreso, egreso o retiro para mantener tu saldo al día.',
        icon: '★',
        color: '#9E6A00',
        bg: Colors.accentSoft,
        borderColor: 'rgba(255, 184, 0, 0.45)',
        buttonLabel: 'Registrar',
        buttonAction: onMovement,
      }
    : {
        badge: 'ESTADO DE CAJA',
        title: 'Tu caja está al día',
        description: `${movementCount} movimiento${movementCount > 1 ? 's' : ''} registrado${movementCount > 1 ? 's' : ''} en la jornada actual.`,
        icon: '✓',
        color: Colors.success,
        bg: Colors.successSoft,
        borderColor: 'rgba(24, 134, 75, 0.25)',
        buttonLabel: undefined,
        buttonAction: undefined,
      };

  return (
    <View style={styles.container}>
      {/* Tarjeta de impacto principal (Hero) */}
      <JornadaHero jornada={jornada} balance={balance} />

      {/* Tarjeta inteligente de estado / siguiente paso */}
      <Card style={[styles.guideCard, { backgroundColor: guideConfig.bg, borderColor: guideConfig.borderColor }]}>
        <View style={[styles.guideIconBox, { backgroundColor: Colors.surface }]}>
          <AppText variant="title" color={guideConfig.color}>
            {guideConfig.icon}
          </AppText>
        </View>

        <View style={styles.guideCopy}>
          <AppText variant="captionBold" color={guideConfig.color} style={styles.guideBadge}>
            {guideConfig.badge}
          </AppText>
          <AppText variant="heading" color={Colors.text}>
            {guideConfig.title}
          </AppText>
          <AppText variant="body" color={Colors.textMuted}>
            {guideConfig.description}
          </AppText>
        </View>

        {guideConfig.buttonLabel ? (
          <View style={styles.guideButtonWrapper}>
            <AppButton
              label={guideConfig.buttonLabel}
              variant={hasPending ? 'accent' : 'secondary'}
              onPress={guideConfig.buttonAction!}
              style={styles.guideButton}
            />
          </View>
        ) : null}
      </Card>

      {/* Acción primaria de alta prominencia */}
      <View style={styles.primaryAction}>
        <AppButton
          label="+ Registrar movimiento en caja"
          variant="primary"
          onPress={onMovement}
          style={styles.primaryButton}
        />
      </View>

      {/* Sección de accesos directos */}
      <View style={styles.sectionHeader}>
        <AppText variant="heading" color={Colors.text}>
          Atajos de la jornada
        </AppText>
        <AppText variant="body" color={Colors.textMuted}>
          Consulta métricas y gestiona tus operaciones.
        </AppText>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <QuickActionCard
            icon="▣"
            title="Balance"
            description="Desglose contable"
            onPress={onBalance}
            tone="brand"
          />
        </View>

        <View style={styles.gridItem}>
          <QuickActionCard
            icon="≡"
            title="Historial"
            description={`${movementCount} movimiento${movementCount === 1 ? '' : 's'}`}
            onPress={onHistory}
            tone="neutral"
          />
        </View>

        <View style={styles.gridItem}>
          <QuickActionCard
            icon="↔"
            title="Pagos"
            description={hasPending ? `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}` : 'Simulador'}
            onPress={onPayments}
            tone={hasPending ? 'warning' : 'accent'}
            badge={hasPending ? `${pendingCount}` : undefined}
          />
        </View>

        <View style={styles.gridItem}>
          <QuickActionCard
            icon="⚙"
            title="Ajustes"
            description="Herramientas MVP"
            onPress={onSettings}
            tone="neutral"
          />
        </View>
      </View>

      {/* Botón inferior de cierre de jornada */}
      <View style={styles.closeDaySection}>
        <AppButton
          label="Cerrar jornada de caja"
          variant="ghost"
          onPress={onClose}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm + 2,
    borderWidth: 1.5,
  },
  guideIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideCopy: {
    flex: 1,
    gap: 2,
  },
  guideBadge: {
    letterSpacing: 0.5,
  },
  guideButtonWrapper: {
    minWidth: 96,
  },
  guideButton: {
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
  },
  primaryAction: {
    marginTop: Spacing.xxs,
  },
  primaryButton: {
    minHeight: 52,
  },
  sectionHeader: {
    gap: 2,
    marginTop: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    flexBasis: '46%',
    flexGrow: 1,
  },
  closeDaySection: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
  },
});

