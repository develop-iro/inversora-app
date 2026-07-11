import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';

import { useCarouselDotProgress } from '@/shared/components/carousels/use-carousel-dot-progress';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type CarouselDotsProps = {
  count: number;
  activeIndex: number;
  accessibilityLabel?: string;
  className?: string;
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
  className,
  style,
  animateScale = false,
}: CarouselDotsProps) {
  const theme = useTheme(); // tailwind-exception: animated dot color interpolation
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
      className={cn('flex-row items-center justify-center gap-sm', className)}
      style={style}
    >
      {dotProgress.map((progress, index) => (
        <Animated.View
          accessible={false}
          key={`carousel-dot-${index}`}
          className="h-2 rounded-full"
          // tailwind-exception: animated width, scale, and color interpolation
          style={[
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
