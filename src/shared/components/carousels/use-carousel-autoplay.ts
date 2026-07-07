import { useCallback, useEffect, useRef, useState } from 'react';
import type { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type UseCarouselAutoplayOptions = {
  itemCount: number;
  autoplayMs: number;
  enabled?: boolean;
  reduceMotion?: boolean;
};

/**
 * Shared autoplay, pause/resume, and index sync for horizontal carousels.
 */
export function useCarouselAutoplay<T>({
  itemCount,
  autoplayMs,
  enabled = true,
  reduceMotion = false,
}: UseCarouselAutoplayOptions) {
  const listRef = useRef<FlatList<T>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const currentIndexRef = useRef(0);
  const deadlineRef = useRef(0);
  const remainingMsRef = useRef(autoplayMs);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    remainingMsRef.current = autoplayMs;
  }, [autoplayMs]);

  const pauseAutoplay = useCallback(() => {
    if (!isInteractionPaused) {
      if (deadlineRef.current === 0) {
        deadlineRef.current = Date.now() + autoplayMs;
      }
      remainingMsRef.current = Math.max(300, deadlineRef.current - Date.now());
      setIsInteractionPaused(true);
    }
  }, [autoplayMs, isInteractionPaused]);

  const resumeAutoplay = useCallback(() => {
    if (isInteractionPaused) {
      deadlineRef.current = Date.now() + remainingMsRef.current;
      setIsInteractionPaused(false);
    }
  }, [isInteractionPaused]);

  const resetAutoplayDeadline = useCallback(() => {
    remainingMsRef.current = autoplayMs;
    deadlineRef.current = Date.now() + autoplayMs;
  }, [autoplayMs]);

  const syncToIndex = useCallback(
    (nextIndex: number, animate = true) => {
      if (itemCount === 0) {
        return;
      }

      const boundedIndex = Math.max(0, Math.min(nextIndex, itemCount - 1));

      if (boundedIndex !== currentIndexRef.current) {
        setCurrentIndex(boundedIndex);
        currentIndexRef.current = boundedIndex;
      }

      resetAutoplayDeadline();
      listRef.current?.scrollToIndex({
        index: boundedIndex,
        animated: animate,
      });
    },
    [itemCount, resetAutoplayDeadline],
  );

  useEffect(() => {
    if (!enabled || reduceMotion || itemCount <= 1 || isInteractionPaused) {
      return;
    }

    if (deadlineRef.current === 0) {
      deadlineRef.current = Date.now() + remainingMsRef.current;
    }

    const delay = Math.max(300, deadlineRef.current - Date.now());

    const timeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % itemCount;
      syncToIndex(nextIndex, true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentIndex, enabled, isInteractionPaused, itemCount, reduceMotion, syncToIndex]);

  const syncIndexFromOffset = useCallback(
    (offsetX: number, itemInterval: number) => {
      if (itemInterval <= 0 || itemCount === 0) {
        return;
      }

      const rawIndex = Math.round(offsetX / itemInterval);
      const boundedIndex = Math.max(0, Math.min(rawIndex, itemCount - 1));

      if (boundedIndex !== currentIndexRef.current) {
        setCurrentIndex(boundedIndex);
        currentIndexRef.current = boundedIndex;
        resetAutoplayDeadline();
      }
    },
    [itemCount, resetAutoplayDeadline],
  );

  const handleScrollEvent = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>, itemInterval: number) => {
      syncIndexFromOffset(event.nativeEvent.contentOffset.x, itemInterval);
    },
    [syncIndexFromOffset],
  );

  const handleScrollToIndexFailed = useCallback(
    (itemInterval: number) => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({
          offset: currentIndex * itemInterval,
          animated: false,
        });
      });
    },
    [currentIndex],
  );

  const interactionHandlers = {
    onTouchStart: pauseAutoplay,
    onTouchEnd: resumeAutoplay,
  };

  return {
    listRef,
    currentIndex,
    currentIndexRef,
    pauseAutoplay,
    resumeAutoplay,
    syncToIndex,
    handleScrollEvent,
    handleScrollToIndexFailed,
    interactionHandlers,
  };
}
