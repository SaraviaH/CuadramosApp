import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../../theme';
import { AppText } from '../../atoms';
import { HistoryCardItem } from '../../molecules';
import { RegistroHistorialCaja } from '../../types';

interface Props {
  boxes: RegistroHistorialCaja[];
  onSelectBox: (box: RegistroHistorialCaja) => void;
}

export function BoxHistoryList({ boxes, onSelectBox }: Props) {
  if (boxes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AppText variant="caption" style={styles.emptyText}>No hay cajas archivadas registradas.</AppText>
      </View>
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
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.muted,
  },
});
