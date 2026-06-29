import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { HomeHeroSlideCard } from '@/features/onboarding/components/home-hero-slide-card';
import {
  HOME_HERO_SLIDES,
  type HomeHeroSlide,
  type HomeHeroSlideAction,
} from '@/features/onboarding/constants/home-hero-slides';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { Layout, Spacing } from '@/shared/theme/theme';

export type HomeHeroCarouselProps = {
  onSlideAction?: (action: HomeHeroSlideAction) => void;
};

const AUTOPLAY_MS = 5500;

/**
 * Auto-advancing hero carousel for the minimal home layout.
 */
export function HomeHeroCarousel({ onSlideAction }: HomeHeroCarouselProps) {
  const listRef = useRef<FlatList<HomeHeroSlide>>(null);
  const reducedMotionEnabled = useReducedMotion();
  const [viewportWidth, setViewportWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const currentIndexRef = useRef(0);
  const deadlineRef = useRef(0);
  const remainingMsRef = useRef(AUTOPLAY_MS);

  const slides = HOME_HERO_SLIDES;
  const dotProgress = useMemo(
    () =>
      Array.from(
        { length: slides.length },
        (_, index) => new Animated.Value(index === 0 ? 1 : 0),
      ),
    [slides.length],
  );

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const syncToIndex = useCallback(
    (nextIndex: number, animate = true) => {
      if (slides.length === 0 || viewportWidth <= 0) {
        return;
      }

      const boundedIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));

      if (boundedIndex !== currentIndexRef.current) {
        setCurrentIndex(boundedIndex);
        currentIndexRef.current = boundedIndex;
      }

      remainingMsRef.current = AUTOPLAY_MS;
      deadlineRef.current = Date.now() + AUTOPLAY_MS;
      listRef.current?.scrollToIndex({
        index: boundedIndex,
        animated: animate,
      });
    },
    [slides.length, viewportWidth],
  );

  const pauseAutoplay = useCallback(() => {
    if (!isInteractionPaused) {
      if (deadlineRef.current === 0) {
        deadlineRef.current = Date.now() + AUTOPLAY_MS;
      }
      remainingMsRef.current = Math.max(300, deadlineRef.current - Date.now());
      setIsInteractionPaused(true);
    }
  }, [isInteractionPaused]);

  const resumeAutoplay = useCallback(() => {
    if (isInteractionPaused) {
      deadlineRef.current = Date.now() + remainingMsRef.current;
      setIsInteractionPaused(false);
    }
  }, [isInteractionPaused]);

  useEffect(() => {
    if (
      reducedMotionEnabled ||
      slides.length <= 1 ||
      isInteractionPaused ||
      viewportWidth <= 0
    ) {
      return;
    }

    if (deadlineRef.current === 0) {
      deadlineRef.current = Date.now() + remainingMsRef.current;
    }

    const delay = Math.max(300, deadlineRef.current - Date.now());

    const timeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      syncToIndex(nextIndex, true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    currentIndex,
    isInteractionPaused,
    reducedMotionEnabled,
    slides.length,
    syncToIndex,
    viewportWidth,
  ]);

  useEffect(() => {
    if (dotProgress.length === 0) {
      return;
    }

    if (reducedMotionEnabled) {
      dotProgress.forEach((value, index) => {
        value.setValue(index === currentIndex ? 1 : 0);
      });
      return;
    }

    Animated.parallel(
      dotProgress.map((value, index) =>
        Animated.timing(value, {
          toValue: index === currentIndex ? 1 : 0,
          duration: 260,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [currentIndex, dotProgress, reducedMotionEnabled]);

  const syncIndexFromOffset = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (viewportWidth <= 0 || slides.length === 0) {
        return;
      }

      const rawIndex = Math.round(event.nativeEvent.contentOffset.x / viewportWidth);
      const boundedIndex = Math.max(0, Math.min(rawIndex, slides.length - 1));

      if (boundedIndex !== currentIndexRef.current) {
        setCurrentIndex(boundedIndex);
        currentIndexRef.current = boundedIndex;
        remainingMsRef.current = AUTOPLAY_MS;
        deadlineRef.current = Date.now() + AUTOPLAY_MS;
      }
    },
    [slides.length, viewportWidth],
  );

  const handleScrollToIndexFailed = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: currentIndex * viewportWidth,
        animated: false,
      });
    });
  }, [currentIndex, viewportWidth]);

  return (
    <View
      style={[styles.wrapper, { paddingHorizontal: Layout.screenPaddingHorizontal }]}
      accessibilityRole="adjustable"
      accessibilityLabel={`Mensaje educativo ${currentIndex + 1} de ${slides.length}`}
      accessibilityHint="Desliza horizontalmente para ver más mensajes"
    >
      <View
        onLayout={(event) => {
          setViewportWidth(event.nativeEvent.layout.width);
        }}
        onTouchStart={pauseAutoplay}
        onTouchEnd={resumeAutoplay}
        style={styles.viewport}
      >
        {viewportWidth > 0 ? (
          <FlatList
            ref={listRef}
            data={[...slides]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={pauseAutoplay}
            onScroll={syncIndexFromOffset}
            onScrollEndDrag={syncIndexFromOffset}
            onMomentumScrollEnd={syncIndexFromOffset}
            onScrollToIndexFailed={handleScrollToIndexFailed}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: viewportWidth,
              offset: viewportWidth * index,
              index,
            })}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width: viewportWidth }}>
                <HomeHeroSlideCard
                  slide={item}
                  onCtaPress={() => {
                    pauseAutoplay();
                    onSlideAction?.(item.action);
                  }}
                />
              </View>
            )}
          />
        ) : null}
      </View>

      {slides.length > 1 ? (
        <View
          accessibilityRole="text"
          accessibilityLabel={`Diapositiva ${currentIndex + 1} de ${slides.length}`}
          style={styles.indicators}
        >
          {slides.map((slide, index) => (
            <Animated.View
              accessible={false}
              key={slide.id}
              style={[
                styles.dot,
                {
                  width:
                    dotProgress[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 22],
                    }) ?? 8,
                  backgroundColor:
                    dotProgress[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        'rgba(0, 0, 0, 0.2)',
                        'rgba(0, 191, 166, 0.9)',
                      ],
                    }) ?? 'rgba(0, 0, 0, 0.2)',
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  viewport: {
    width: '100%',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },
});
