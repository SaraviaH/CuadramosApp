import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../theme';
import { EmptyState, HistoryCardItem } from '../../molecules';
import { RegistroHistorialCaja } from '../../types';

interface Props {
  boxes: RegistroHistorialCaja[];
  onSelectBox: (box: RegistroHistorialCaja) => void;
  onOpenDay?: () => void;
}

export function BoxHistoryList({ boxes, onSelectBox, onOpenDay }: Props) {
  if (boxes.length === 0) {
    return (
      <EmptyState
        icon="clock"
        tone="brand"
        variant="dashed"
        title="Sin cajas archivadas"
        subtitle="No hay cajas archivadas registradas. Abre tu primera jornada para empezar a registrar."
        actionLabel={onOpenDay ? 'Abrir jornada' : undefined}
        actionIcon={onOpenDay ? '+' : undefined}
        onActionPress={onOpenDay}
      />
    );
  }

  return (
    <View style={styles.list}>
      {boxes.map(box => (
        <HistoryCardItem
          key={box.id}
          box={box}
          onPress={() => onSelectBox(box)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.xs,
  },
});
