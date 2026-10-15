import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, IconBox } from '../../atoms';
import { SectionHeader } from '../../molecules';
import { HighlightedMetric } from '../../services';

interface Props {
  metrics: HighlightedMetric[];
  onPressDetails?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - Spacing.md * 2, 400);

export function MetricsCarousel({ metrics, onPressDetails }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + Spacing.sm));
    if (index >= 0 && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (!metrics || metrics.length === 0) {
    return (
      <View style={styles.container}>
        <SectionHeader
          icon="chart"
          title="Métricas destacadas"
          actionLabel="Ver resumen ›"
          actionAccessibilityLabel="Ver resumen completo"
          onAction={onPressDetails}
        />
        <View style={styles.emptyCard}>
          <AppText style={styles.emptyText}>Sin métricas todavía</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader
        icon="chart"
        title="Métricas destacadas"
        actionLabel="Ver resumen ›"
        actionAccessibilityLabel="Ver resumen completo"
        onAction={onPressDetails}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + Spacing.sm}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {metrics.map(metric => (
          <Pressable
            key={metric.id}
            accessibilityRole="button"
            accessibilityLabel={metric.title}
            onPress={onPressDetails}
            style={({ pressed }) => [
              styles.card,
              { width: CARD_WIDTH, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={styles.cardRow}>
              <IconBox
                name={metric.icon}
                color={metric.iconColor}
                backgroundColor={metric.iconBg}
                size={32}
                iconSize={16}
                shape="card"
              />

              <AppText numberOfLines={2} style={styles.cardTitle}>
                {metric.title}
              </AppText>
            </View>

            <AppText numberOfLines={2} style={styles.cardSubtitle}>
              {metric.subtitle}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Indicadores discretos de paginación */}
      {metrics.length > 1 && (
        <View style={styles.dotsRow}>
          {metrics.map((m, idx) => (
            <View
              key={m.id}
              style={[
                styles.dot,
                idx === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  scrollContent: {
    gap: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  card: {
    ...Surfaces.card,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: 4,
    minHeight: 82,
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardTitle: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    lineHeight: 15,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 14,
    backgroundColor: Colors.brand,
  },
  dotInactive: {
    width: 4,
    backgroundColor: Colors.border,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Radius.card,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  emptyText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
});
