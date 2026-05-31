import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AccessibilityInfo,
    Animated,
    FlatList,
    Platform,
    Pressable,
    StyleSheet,
    useWindowDimensions,
    View,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";

import { FundCard } from "@/features/funds/components/fund-card";
import type { FeaturedFund } from "@/features/funds/models/fund";
import { useTheme } from "@/shared/hooks/use-theme";
import { Layout, Spacing } from "@/shared/theme/theme";

type FeaturedFundsCarouselProps = {
  funds: FeaturedFund[];
  onFundPress: (fund: FeaturedFund) => void;
};

const AUTOPLAY_MS = 6000;
const ARROW_HIDE_BREAKPOINT = 1024;
const ARROW_HIDE_SMALL_BREAKPOINT = 390;

export function FeaturedFundsCarousel({
  funds,
  onFundPress,
}: FeaturedFundsCarouselProps) {
  const listRef = useRef<FlatList<FeaturedFund>>(null);
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [slideWidth, setSlideWidth] = useState(0);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const dotProgress = useMemo(
    () =>
      Array.from(
        { length: funds.length },
        (_, index) => new Animated.Value(index === 0 ? 1 : 0),
      ),
    [funds.length],
  );
  const deadlineRef = useRef(0);
  const remainingMsRef = useRef(AUTOPLAY_MS);
  const currentIndexRef = useRef(0);

  const fallbackWidth = useMemo(
    () =>
      Math.max(
        280,
        Math.min(windowWidth, Layout.maxContentWidth) -
          Layout.screenPaddingHorizontal * 2,
      ),
    [windowWidth],
  );
  const showNavArrows =
    funds.length > 1 &&
    windowWidth > ARROW_HIDE_SMALL_BREAKPOINT &&
    !(Platform.OS === "web" && windowWidth >= ARROW_HIDE_BREAKPOINT);

  const arrowGutter = useMemo(() => {
    if (!showNavArrows) {
      return 0;
    }
    if (windowWidth < 520) {
      return 18;
    }
    return 40;
  }, [showNavArrows, windowWidth]);

  const effectiveSlideWidth = slideWidth > 0 ? slideWidth : fallbackWidth;

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

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

  const syncToIndex = useCallback(
    (nextIndex: number, animate = true) => {
      if (funds.length === 0) {
        return;
      }

      const boundedIndex = Math.max(0, Math.min(nextIndex, funds.length - 1));

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
    [funds.length],
  );

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setIsReduceMotionEnabled(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        setIsReduceMotionEnabled(enabled);
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isReduceMotionEnabled || funds.length <= 1 || isInteractionPaused) {
      return;
    }

    if (deadlineRef.current === 0) {
      deadlineRef.current = Date.now() + remainingMsRef.current;
    }

    const delay = Math.max(300, deadlineRef.current - Date.now());

    const timeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % funds.length;
      syncToIndex(nextIndex, true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    currentIndex,
    funds.length,
    isInteractionPaused,
    isReduceMotionEnabled,
    syncToIndex,
  ]);

  useEffect(() => {
    if (dotProgress.length === 0) {
      return;
    }

    if (isReduceMotionEnabled) {
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
  }, [currentIndex, dotProgress, isReduceMotionEnabled]);

  const syncIndexFromOffset = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (effectiveSlideWidth <= 0 || funds.length === 0) {
        return;
      }

      const rawIndex = Math.round(
        event.nativeEvent.contentOffset.x / effectiveSlideWidth,
      );
      const boundedIndex = Math.max(0, Math.min(rawIndex, funds.length - 1));
      if (boundedIndex !== currentIndexRef.current) {
        setCurrentIndex(boundedIndex);
        currentIndexRef.current = boundedIndex;
        remainingMsRef.current = AUTOPLAY_MS;
        deadlineRef.current = Date.now() + AUTOPLAY_MS;
      }
    },
    [effectiveSlideWidth, funds.length],
  );

  const handleScrollToIndexFailed = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: currentIndex * effectiveSlideWidth,
        animated: false,
      });
    });
  }, [currentIndex, effectiveSlideWidth]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.trackRow}>
        {showNavArrows ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ir al fondo destacado anterior"
            accessibilityHint="Mueve el carrusel a la tarjeta anterior"
            onHoverIn={pauseAutoplay}
            onHoverOut={resumeAutoplay}
            onFocus={pauseAutoplay}
            onBlur={resumeAutoplay}
            onPress={() => {
              pauseAutoplay();
              syncToIndex(
                (currentIndexRef.current - 1 + funds.length) % funds.length,
                true,
              );
            }}
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: theme.surface },
              pressed ? styles.navButtonPressed : null,
            ]}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.deepOcean}
            />
          </Pressable>
        ) : null}

        <View
          onLayout={(event) => {
            setSlideWidth(event.nativeEvent.layout.width);
          }}
          onTouchStart={pauseAutoplay}
          onTouchEnd={resumeAutoplay}
          style={[
            styles.viewport,
            showNavArrows ? styles.viewportWithSideControls : null,
          ]}
        >
          <FlatList
            ref={listRef}
            data={funds}
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
              length: effectiveSlideWidth,
              offset: effectiveSlideWidth * index,
              index,
            })}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.slide,
                  { width: effectiveSlideWidth },
                  showNavArrows ? { paddingHorizontal: arrowGutter } : null,
                ]}
              >
                <FundCard
                  fund={item}
                  style={styles.card}
                  onInteractionStart={pauseAutoplay}
                  onInteractionEnd={resumeAutoplay}
                  onPress={() => {
                    pauseAutoplay();
                    onFundPress(item);
                  }}
                />
              </View>
            )}
            style={styles.list}
          />
        </View>

        {showNavArrows ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ir al siguiente fondo destacado"
            accessibilityHint="Mueve el carrusel a la tarjeta siguiente"
            onHoverIn={pauseAutoplay}
            onHoverOut={resumeAutoplay}
            onFocus={pauseAutoplay}
            onBlur={resumeAutoplay}
            onPress={() => {
              pauseAutoplay();
              syncToIndex((currentIndexRef.current + 1) % funds.length, true);
            }}
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: theme.surface },
              pressed ? styles.navButtonPressed : null,
            ]}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.deepOcean}
            />
          </Pressable>
        ) : null}
      </View>

      <View
        accessibilityRole="text"
        accessibilityLabel={`Posicion ${currentIndex + 1} de ${funds.length}`}
        style={styles.indicators}
      >
        {funds.map((fund, index) => (
          <Animated.View
            accessible={false}
            key={fund.id}
            style={[
              styles.dot,
              {
                width:
                  dotProgress[index]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 22],
                  }) ?? 8,
                transform: [
                  {
                    scale:
                      dotProgress[index]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.08],
                      }) ?? 1,
                  },
                ],
                backgroundColor:
                  dotProgress[index]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      "rgba(0, 0, 0, 0.2)",
                      "rgba(0, 191, 166, 0.9)",
                    ],
                  }) ?? "rgba(0, 0, 0, 0.2)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  viewport: {
    flex: 1,
  },
  viewportWithSideControls: {
    minWidth: 0,
  },
  list: {
    width: "100%",
  },
  slide: {
    paddingHorizontal: 0,
  },
  card: {
    width: "100%",
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  navButton: {
    flexShrink: 0,
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  navButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
