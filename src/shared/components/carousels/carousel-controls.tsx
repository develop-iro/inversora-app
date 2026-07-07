import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CarouselNavButton } from '@/shared/components/carousels/carousel-nav-button';
import { TextLabel } from '@/shared/components/text/text-label';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CarouselControlsProps = {
  activeIndex: number;
  count: number;
  onPrevious: () => void;
  onNext: () => void;
  counterLabel?: (activeIndex: number, count: number) => string;
  counterAccessibilityLabel?: (activeIndex: number, count: number) => string;
  previousAccessibilityLabel?: string;
  previousAccessibilityHint?: string;
  nextAccessibilityLabel?: string;
  nextAccessibilityHint?: string;
  onPreviousInteractionStart?: () => void;
  onPreviousInteractionEnd?: () => void;
  onNextInteractionStart?: () => void;
  onNextInteractionEnd?: () => void;
  style?: StyleProp<ViewStyle>;
};

const defaultCounterLabel = (activeIndex: number, count: number): string =>
  `${activeIndex + 1} de ${count}`;

const defaultCounterAccessibilityLabel = (activeIndex: number, count: number): string =>
  `Posición ${activeIndex + 1} de ${count}`;

/**
 * Accessible carousel footer with a position counter and previous/next controls.
 */
export function CarouselControls({
  activeIndex,
  count,
  onPrevious,
  onNext,
  counterLabel = defaultCounterLabel,
  counterAccessibilityLabel = defaultCounterAccessibilityLabel,
  previousAccessibilityLabel = 'Ir a la diapositiva anterior',
  previousAccessibilityHint = 'Mueve el carrusel a la tarjeta anterior',
  nextAccessibilityLabel = 'Ir a la diapositiva siguiente',
  nextAccessibilityHint = 'Mueve el carrusel a la tarjeta siguiente',
  onPreviousInteractionStart,
  onPreviousInteractionEnd,
  onNextInteractionStart,
  onNextInteractionEnd,
  style,
}: CarouselControlsProps) {
  const theme = useTheme();

  if (count <= 1) {
    return null;
  }

  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel="Controles del carrusel"
      style={[styles.row, style]}
    >
      <View
        accessibilityRole="text"
        accessibilityLabel={counterAccessibilityLabel(activeIndex, count)}
        accessibilityLiveRegion="polite"
        importantForAccessibility="yes"
        style={[styles.counter, { backgroundColor: theme.backgroundSoft, borderColor: theme.border }]}
      >
        <TextLabel variant="listMeta" themeColor="textSecondary">
          {counterLabel(activeIndex, count)}
        </TextLabel>
      </View>

      <View style={styles.navGroup}>
        <CarouselNavButton
          direction="previous"
          accessibilityLabel={previousAccessibilityLabel}
          accessibilityHint={previousAccessibilityHint}
          onHoverIn={onPreviousInteractionStart}
          onHoverOut={onPreviousInteractionEnd}
          onFocus={onPreviousInteractionStart}
          onBlur={onPreviousInteractionEnd}
          onPress={onPrevious}
        />
        <CarouselNavButton
          direction="next"
          accessibilityLabel={nextAccessibilityLabel}
          accessibilityHint={nextAccessibilityHint}
          onHoverIn={onNextInteractionStart}
          onHoverOut={onNextInteractionEnd}
          onFocus={onNextInteractionStart}
          onBlur={onNextInteractionEnd}
          onPress={onNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  counter: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 32,
    justifyContent: 'center',
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
