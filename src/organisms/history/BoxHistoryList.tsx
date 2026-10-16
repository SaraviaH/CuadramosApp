import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../theme';
import { EmptyState, HistoryCardItem, SectionHeader } from '../../molecules';
import { RegistroHistorialCaja } from '../../types';
import { formatMonthYear } from '../../utils';

interface Props {
  boxes: RegistroHistorialCaja[];
  onSelectBox: (box: RegistroHistorialCaja) => void;
  onOpenDay?: () => void;
  /** Id de la caja en curso: se muestra aparte, arriba del todo. */
  openBoxId?: string | null;
}

export interface BoxMonthSection {
  monthKey: string;
  title: string;
  data: RegistroHistorialCaja[];
}

/** Fecha real (ISO) de la caja; cae en `updatedAt` para registros heredados. */
const boxDateIso = (box: RegistroHistorialCaja): string =>
  box.fechaHoraApertura || box.updatedAt || '';

/** Agrupa las cajas por mes (más reciente primero, conservando el orden de entrada). */
export const groupBoxesByMonth = (items: RegistroHistorialCaja[]): BoxMonthSection[] => {
  const sections = new Map<string, BoxMonthSection>();

  for (const box of items) {
    const iso = boxDateIso(box);
    const date = iso ? new Date(iso) : new Date(NaN);
    const valid = !isNaN(date.getTime());
    const monthKey = valid
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : 'sin-fecha';

    let section = sections.get(monthKey);
    if (!section) {
      section = { monthKey, title: valid ? formatMonthYear(iso) : 'Sin fecha', data: [] };
      sections.set(monthKey, section);
    }
    section.data.push(box);
  }

  return Array.from(sections.values());
};

export function BoxHistoryList({ boxes, onSelectBox, onOpenDay, openBoxId }: Props) {
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

  const openBox = openBoxId ? boxes.find(box => box.id === openBoxId) : undefined;
  const closedBoxes = openBox ? boxes.filter(box => box.id !== openBox.id) : boxes;
  const sections = groupBoxesByMonth(closedBoxes);

  return (
    <View style={styles.list}>
      {openBox ? (
        <View>
          <SectionHeader icon="clock" title="En curso" />
          <HistoryCardItem box={openBox} onPress={() => onSelectBox(openBox)} />
        </View>
      ) : null}

      {sections.map(section => (
        <View key={section.monthKey}>
          <SectionHeader
            icon="calendar"
            title={section.title}
            badge={String(section.data.length)}
          />
          <View style={styles.cards}>
            {section.data.map(box => (
              <HistoryCardItem
                key={box.id}
                box={box}
                onPress={() => onSelectBox(box)}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  cards: {
    gap: Spacing.xs,
  },
});
