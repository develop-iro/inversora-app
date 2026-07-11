import { View, type StyleProp, type ViewStyle } from 'react-native';

import { CarouselNavButton } from '@/shared/components/carousels/carousel-nav-button';
import { TextLabel } from '@/shared/components/text/text-label';
import { cn } from '@/shared/utils/cn';

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
  className?: string;
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
  className,
  style,
}: CarouselControlsProps) {
  if (count <= 1) {
    return null;
  }

  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel="Controles del carrusel"
      className={cn('flex-row items-center justify-between gap-md', className)}
      style={style}
    >
      <View
        accessibilityRole="text"
        accessibilityLabel={counterAccessibilityLabel(activeIndex, count)}
        accessibilityLiveRegion="polite"
        importantForAccessibility="yes"
        className="min-h-[32px] justify-center rounded-pill border border-border bg-background-soft px-md py-xs"
      >
        <TextLabel variant="listMeta" themeColor="textSecondary">
          {counterLabel(activeIndex, count)}
        </TextLabel>
      </View>

      <View className="flex-row items-center gap-sm">
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
