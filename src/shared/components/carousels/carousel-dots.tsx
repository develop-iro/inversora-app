import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useCarouselDotProgress } from '@/shared/components/carousels/use-carousel-dot-progress';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CarouselDotsProps = {
  count: number;
  activeIndex: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  animateScale?: boolean;
};

/**
 * Page indicator dots for horizontal carousels.
 */
export function CarouselDots({
  count,
  activeIndex,
  accessibilityLabel,
  style,
  animateScale = false,
}: CarouselDotsProps) {
  const theme = useTheme();
  const dotProgress = useCarouselDotProgress(count, activeIndex);

  if (count <= 1) {
    return null;
  }

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={
        accessibilityLabel ?? `Diapositiva ${activeIndex + 1} de ${count}`
      }
      style={[styles.indicators, style]}
    >
      {dotProgress.map((progress, index) => (
        <Animated.View
          accessible={false}
          key={`carousel-dot-${index}`}
          style={[
            styles.dot,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 22],
              }),
              transform: animateScale
                ? [
                    {
                      scale: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.08],
                      }),
                    },
                  ]
                : undefined,
              backgroundColor: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.carouselDotInactive, theme.primary],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: Radius.full,
  },
});
