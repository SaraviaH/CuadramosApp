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
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText, IconBox } from '../../atoms';
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
        <View style={styles.titleRow}>
          <AppText style={styles.sectionTitle}>Métricas destacadas</AppText>
        </View>
        <View style={styles.emptyCard}>
          <AppText style={styles.emptyText}>Sin métricas todavía</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <AppText style={styles.sectionTitle}>Métricas destacadas</AppText>
        {onPressDetails && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver resumen completo"
            onPress={onPressDetails}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppText style={styles.seeMoreLink}>Ver resumen ›</AppText>
          </Pressable>
        )}
      </View>

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
            <View style={styles.cardHeader}>
              <IconBox
                name={metric.icon}
                color={metric.iconColor}
                backgroundColor={metric.iconBg}
                size={32}
                iconSize={16}
                shape="card"
              />
            </View>

            <View style={styles.cardBody}>
              <AppText numberOfLines={1} adjustsFontSizeToFit style={styles.cardTitle}>
                {metric.title}
              </AppText>
              <AppText numberOfLines={1} style={styles.cardSubtitle}>
                {metric.subtitle}
              </AppText>
            </View>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.muted,
  },
  seeMoreLink: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brand,
  },
  scrollContent: {
    gap: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.card,
    minHeight: 82,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBody: {
    gap: 2,
  },
  cardTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
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
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  emptyText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    color: Colors.muted,
  },
});
