import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  View,
  useWindowDimensions,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { CarouselControls } from '@/shared/components/carousels/carousel-controls';
import { CarouselDots } from '@/shared/components/carousels/carousel-dots';
import { useCarouselAutoplay } from '@/shared/components/carousels/use-carousel-autoplay';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';

export type CarouselShellProps<T> = {
  data: readonly T[];
  keyExtractor: (item: T) => string;
  renderSlide: (item: T, slideWidth: number) => ReactNode;
  autoplayMs?: number;
  autoplayEnabled?: boolean;
  animateDots?: boolean;
  showDots?: boolean;
  showControls?: boolean;
  dotsAccessibilityLabel?: (activeIndex: number, count: number) => string;
  counterLabel?: (activeIndex: number, count: number) => string;
  counterAccessibilityLabel?: (activeIndex: number, count: number) => string;
  previousAccessibilityLabel?: string;
  previousAccessibilityHint?: string;
  nextAccessibilityLabel?: string;
  nextAccessibilityHint?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  wrapperClassName?: string;
  viewportStyle?: StyleProp<ViewStyle>;
  accessibilityRole?: 'adjustable' | 'none';
  accessibilityLabel?: string | ((activeIndex: number, count: number) => string);
  accessibilityHint?: string;
};

/**
 * Paging horizontal carousel with optional autoplay and dot indicators.
 */
export function CarouselShell<T>({
  data,
  keyExtractor,
  renderSlide,
  autoplayMs = 5500,
  autoplayEnabled = true,
  animateDots = false,
  showDots = false,
  showControls = true,
  dotsAccessibilityLabel,
  counterLabel,
  counterAccessibilityLabel,
  previousAccessibilityLabel,
  previousAccessibilityHint,
  nextAccessibilityLabel,
  nextAccessibilityHint,
  wrapperStyle,
  wrapperClassName,
  viewportStyle,
  accessibilityRole = 'adjustable',
  accessibilityLabel,
  accessibilityHint,
}: CarouselShellProps<T>) {
  const reducedMotionEnabled = useReducedMotion();
  const { width: windowWidth } = useWindowDimensions();
  const [viewportWidth, setViewportWidth] = useState(0);
  const resolvedViewportWidth = useMemo(
    () => (viewportWidth > 0 ? viewportWidth : Math.max(280, windowWidth)),
    [viewportWidth, windowWidth],
  );

  const {
    listRef,
    currentIndex,
    currentIndexRef,
    pauseAutoplay,
    resumeAutoplay,
    syncToIndex,
    handleScrollEvent,
    handleScrollToIndexFailed,
    interactionHandlers,
  } = useCarouselAutoplay<T>({
    itemCount: data.length,
    autoplayMs,
    enabled: autoplayEnabled && resolvedViewportWidth > 0,
    reduceMotion: reducedMotionEnabled,
  });

  const renderItem = useCallback<ListRenderItem<T>>(
    ({ item }) => (
      <View style={{ width: resolvedViewportWidth }}>
        {renderSlide(item, resolvedViewportWidth)}
      </View>
    ),
    [renderSlide, resolvedViewportWidth],
  );

  const resolvedDotsLabel =
    dotsAccessibilityLabel?.(currentIndex, data.length) ??
    `Posición ${currentIndex + 1} de ${data.length}`;

  const goToPrevious = useCallback(() => {
    pauseAutoplay();
    syncToIndex((currentIndexRef.current - 1 + data.length) % data.length, true);
  }, [currentIndexRef, data.length, pauseAutoplay, syncToIndex]);

  const goToNext = useCallback(() => {
    pauseAutoplay();
    syncToIndex((currentIndexRef.current + 1) % data.length, true);
  }, [currentIndexRef, data.length, pauseAutoplay, syncToIndex]);

  const resolvedAccessibilityLabel =
    typeof accessibilityLabel === 'function'
      ? accessibilityLabel(currentIndex, data.length)
      : accessibilityLabel;

  return (
    <View
      className={['gap-md', wrapperClassName].filter(Boolean).join(' ')}
      style={wrapperStyle}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={resolvedAccessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <View
        onLayout={(event) => {
          setViewportWidth(event.nativeEvent.layout.width);
        }}
        {...interactionHandlers}
        className="w-full"
        style={viewportStyle}
      >
        {resolvedViewportWidth > 0 ? (
          <FlatList
            ref={listRef}
            data={[...data]}
            horizontal
            nestedScrollEnabled
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={pauseAutoplay}
            onScroll={(event) => {
              handleScrollEvent(event, resolvedViewportWidth);
            }}
            onScrollEndDrag={(event) => {
              handleScrollEvent(event, resolvedViewportWidth);
            }}
            onMomentumScrollEnd={(event) => {
              handleScrollEvent(event, resolvedViewportWidth);
            }}
            onScrollToIndexFailed={() => {
              handleScrollToIndexFailed(resolvedViewportWidth);
            }}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: resolvedViewportWidth,
              offset: resolvedViewportWidth * index,
              index,
            })}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        ) : null}
      </View>

      {showControls ? (
        <CarouselControls
          activeIndex={currentIndex}
          count={data.length}
          counterLabel={counterLabel}
          counterAccessibilityLabel={counterAccessibilityLabel}
          previousAccessibilityLabel={previousAccessibilityLabel}
          previousAccessibilityHint={previousAccessibilityHint}
          nextAccessibilityLabel={nextAccessibilityLabel}
          nextAccessibilityHint={nextAccessibilityHint}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onPreviousInteractionStart={pauseAutoplay}
          onPreviousInteractionEnd={resumeAutoplay}
          onNextInteractionStart={pauseAutoplay}
          onNextInteractionEnd={resumeAutoplay}
        />
      ) : null}

      {showDots ? (
        <CarouselDots
          count={data.length}
          activeIndex={currentIndex}
          accessibilityLabel={resolvedDotsLabel}
          animateScale={animateDots}
        />
      ) : null}
    </View>
  );
}
