import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../theme';
import { EmptyState, HistoryCardItem } from '../../molecules';
import { RegistroHistorialCaja } from '../../types';

interface Props {
  boxes: RegistroHistorialCaja[];
  onSelectBox: (box: RegistroHistorialCaja) => void;
}

export function BoxHistoryList({ boxes, onSelectBox }: Props) {
  if (boxes.length === 0) {
    return (
      <EmptyState
        icon="clock"
        tone="brand"
        variant="plain"
        title="Sin cajas archivadas"
        subtitle="No hay cajas archivadas registradas."
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
