import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '../../atoms';
import { PendingEventItem } from '../../molecules';
import { EventoPago } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';

interface Props {
  events: EventoPago[];
  onConfirm: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export function PendingEventsPanel({ events, onConfirm, onCancel }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const process = async (id: string, action: (value: string) => Promise<void>) => {
    setBusyId(id);
    try {
      await action(id);
    } catch {
      // El contexto reporta el mensaje en la notificación superior
    } finally {
      setBusyId(null);
    }
  };

  if (!events.length) {
    return (
      <Card style={styles.emptyCard}>
        <View style={styles.emptyIconBox}>
          <AppText variant="title" color={Colors.success}>
            ✓
          </AppText>
        </View>
        <AppText variant="heading" color={Colors.text} align="center">
          Sin pagos pendientes
        </AppText>
        <AppText variant="body" color={Colors.textMuted} align="center" style={styles.emptySubtitle}>
          Todos los cobros y pagos digitales han sido confirmados o descartados.
        </AppText>
      </Card>
    );
  }

  return (
    <View style={styles.list}>
      {events.map(event => (
        <View
          key={event.idOperacion}
          pointerEvents={busyId ? 'none' : 'auto'}
          style={busyId === event.idOperacion ? styles.busy : undefined}
        >
          <PendingEventItem
            event={event}
            onConfirm={() => process(event.idOperacion, onConfirm)}
            onCancel={() => process(event.idOperacion, onCancel)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  busy: {
    opacity: 0.55,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    maxWidth: 290,
    marginTop: 2,
  },
});

