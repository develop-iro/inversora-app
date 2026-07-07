import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

/**
 * Animated opacity/width drivers for carousel page indicators.
 */
export function useCarouselDotProgress(itemCount: number, activeIndex: number): Animated.Value[] {
  const dotProgress = useMemo(
    () =>
      Array.from({ length: itemCount }, (_, index) => new Animated.Value(index === 0 ? 1 : 0)),
    [itemCount],
  );

  useEffect(() => {
    const animations = dotProgress.map((value, index) =>
      Animated.timing(value, {
        toValue: index === activeIndex ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
    );

    Animated.parallel(animations).start();
  }, [activeIndex, dotProgress]);

  return dotProgress;
}
