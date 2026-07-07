import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";

import { CardFund } from "@/features/funds/components/card-fund";
import type { FeaturedFund } from "@/core/domain/fund";
import { CarouselControls, CarouselNavButton, useCarouselAutoplay } from "@/shared/components/carousels";
import { SkeletonBone, SkeletonShimmerProvider } from "@/shared/components/ui";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { Layout, Spacing } from "@/shared/theme/theme";
import type { WithLoading } from "@/shared/types/component-loading";

type FeaturedFundsCarouselContentProps = {
  funds: FeaturedFund[];
  onFundPress: (fund: FeaturedFund) => void;
};

export type FeaturedFundsCarouselProps = WithLoading<FeaturedFundsCarouselContentProps>;

/** Horizontal inset when rendered inside `HomeSectionCard` with `bleedContent`. */
const SECTION_CARD_HORIZONTAL_INSET =
  Layout.screenPaddingHorizontal * 2 + Spacing.lg * 2;

/** Matches `CardFund` min height so the carousel is visible inside a vertical scroll. */
const CAROUSEL_MIN_HEIGHT = 420;

const AUTOPLAY_MS = 6000;
const ARROW_HIDE_BREAKPOINT = 1024;
const MOBILE_CAROUSEL_BREAKPOINT = 768;
const MOBILE_CARD_WIDTH_RATIO = 0.86;
const STATIC_GRID_BREAKPOINT = 1024;

function FeaturedFundsCarouselLoading() {
  return (
    <SkeletonShimmerProvider>
      <View
        className="gap-md px-lg pb-lg pt-sm"
        accessibilityLabel="Cargando fondos destacados"
      >
        <View className="min-h-[420px] gap-lg">
          <View className="flex-row items-center gap-md">
            <SkeletonBone width={40} height={40} borderRadius={9999} />
            <View className="flex-1 gap-sm">
              <SkeletonBone width="72%" height={18} />
              <SkeletonBone width="48%" height={14} />
            </View>
          </View>
          <SkeletonBone width="100%" height={5} borderRadius={9999} />
          <SkeletonBone width={140} height={52} borderRadius={56} />
          <View className="mt-sm flex-row gap-md">
            <SkeletonBone width={72} height={36} />
            <SkeletonBone width={88} height={28} borderRadius={16} />
          </View>
          <SkeletonBone width="55%" height={14} />
        </View>
        <View className="flex-row justify-center gap-sm">
          <SkeletonBone width={22} height={8} borderRadius={9999} />
          <SkeletonBone width={8} height={8} borderRadius={9999} />
          <SkeletonBone width={8} height={8} borderRadius={9999} />
        </View>
      </View>
    </SkeletonShimmerProvider>
  );
}

export function FeaturedFundsCarousel(props: FeaturedFundsCarouselProps) {
  if (props.loading) {
    return <FeaturedFundsCarouselLoading />;
  }

  return <FeaturedFundsCarouselContent funds={props.funds} onFundPress={props.onFundPress} />;
}

function FeaturedFundsCarouselContent({
  funds,
  onFundPress,
}: FeaturedFundsCarouselContentProps) {
  const { width: windowWidth } = useWindowDimensions();
  const isReduceMotionEnabled = useReducedMotion();
  const [slideWidth, setSlideWidth] = useState(0);

  const useStaticGrid = windowWidth >= STATIC_GRID_BREAKPOINT;
  const useMobilePreviewCarousel =
    !useStaticGrid && windowWidth < MOBILE_CAROUSEL_BREAKPOINT;
  const fallbackWidth = useMemo(
    () =>
      Math.max(
        280,
        Math.min(windowWidth, Layout.maxContentWidth) -
          SECTION_CARD_HORIZONTAL_INSET,
      ),
    [windowWidth],
  );
  const viewportWidth = slideWidth > 0 ? slideWidth : fallbackWidth;
  const mobileCardWidth = Math.min(
    Math.max(0, viewportWidth - Spacing.sm),
    Math.max(240, Math.round(windowWidth * MOBILE_CARD_WIDTH_RATIO)),
  );
  const cardWidth = useMobilePreviewCarousel
    ? mobileCardWidth
    : viewportWidth;
  const cardGap = useMobilePreviewCarousel ? Spacing.md : 0;
  const effectiveItemInterval = useMobilePreviewCarousel
    ? cardWidth + cardGap
    : viewportWidth;
  const carouselEndPadding = useMobilePreviewCarousel
    ? Math.max(0, viewportWidth - cardWidth)
    : 0;
  const showNavArrows =
    funds.length > 1 &&
    !useMobilePreviewCarousel &&
    !(Platform.OS === "web" && windowWidth >= ARROW_HIDE_BREAKPOINT);

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
  } = useCarouselAutoplay<FeaturedFund>({
    itemCount: funds.length,
    autoplayMs: AUTOPLAY_MS,
    enabled: !useStaticGrid && funds.length > 1,
    reduceMotion: isReduceMotionEnabled,
  });

  const arrowGutter = useMemo(() => {
    if (!showNavArrows) {
      return 0;
    }
    if (windowWidth < 520) {
      return 18;
    }
    return 40;
  }, [showNavArrows, windowWidth]);

  const handleScroll = useCallback(
    (event: Parameters<typeof handleScrollEvent>[0]) => {
      handleScrollEvent(event, effectiveItemInterval);
    },
    [effectiveItemInterval, handleScrollEvent],
  );

  const handleScrollIndexFailed = useCallback(() => {
    handleScrollToIndexFailed(effectiveItemInterval);
  }, [effectiveItemInterval, handleScrollToIndexFailed]);

  const goToPrevious = useCallback(() => {
    pauseAutoplay();
    syncToIndex((currentIndexRef.current - 1 + funds.length) % funds.length, true);
  }, [currentIndexRef, funds.length, pauseAutoplay, syncToIndex]);

  const goToNext = useCallback(() => {
    pauseAutoplay();
    syncToIndex((currentIndexRef.current + 1) % funds.length, true);
  }, [currentIndexRef, funds.length, pauseAutoplay, syncToIndex]);

  if (useStaticGrid) {
    return (
      <View className="gap-md px-lg pb-xl pt-sm">
        <View className="flex-row flex-wrap items-stretch gap-md">
          {funds.map((item) => (
            <CardFund
              fund={item}
              key={item.id}
              onPress={() => {
                onFundPress(item);
              }}
              style={{
                flexBasis: '48%',
                flexGrow: 1,
                minWidth: 300,
                alignSelf: 'stretch',
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  if (funds.length === 0) {
    return null;
  }

  return (
    <View className="gap-md px-lg pb-lg pt-sm">
      <View className="min-h-[420px] flex-row items-stretch gap-sm">
        {showNavArrows ? (
          <CarouselNavButton
            direction="previous"
            accessibilityLabel="Ir al fondo destacado anterior"
            accessibilityHint="Mueve el carrusel a la tarjeta anterior"
            onHoverIn={pauseAutoplay}
            onHoverOut={resumeAutoplay}
            onFocus={pauseAutoplay}
            onBlur={resumeAutoplay}
            onPress={goToPrevious}
          />
        ) : null}

        <View
          onLayout={(event) => {
            setSlideWidth(event.nativeEvent.layout.width);
          }}
          {...interactionHandlers}
          className="min-w-0 flex-1"
          style={{ minHeight: CAROUSEL_MIN_HEIGHT }}
        >
          <FlatList
            ref={listRef}
            data={funds}
            horizontal
            nestedScrollEnabled
            pagingEnabled={!useMobilePreviewCarousel}
            snapToInterval={
              useMobilePreviewCarousel ? effectiveItemInterval : undefined
            }
            snapToAlignment="start"
            decelerationRate={useMobilePreviewCarousel ? "fast" : "normal"}
            disableIntervalMomentum={useMobilePreviewCarousel}
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={pauseAutoplay}
            onScroll={handleScroll}
            onScrollEndDrag={handleScroll}
            onMomentumScrollEnd={handleScroll}
            onScrollToIndexFailed={handleScrollIndexFailed}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: effectiveItemInterval,
              offset: effectiveItemInterval * index,
              index,
            })}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                className="self-stretch"
                style={[
                  {
                    marginRight:
                      useMobilePreviewCarousel && index < funds.length - 1
                        ? cardGap
                        : 0,
                    width: cardWidth,
                    minHeight: CAROUSEL_MIN_HEIGHT,
                  },
                  showNavArrows ? { paddingHorizontal: arrowGutter } : null,
                ]}
              >
                <CardFund
                  fund={item}
                  style={{ width: '100%', flex: 1 }}
                  onInteractionStart={pauseAutoplay}
                  onInteractionEnd={resumeAutoplay}
                  onPress={() => {
                    pauseAutoplay();
                    onFundPress(item);
                  }}
                />
              </View>
            )}
            contentContainerStyle={
              useMobilePreviewCarousel
                ? { paddingRight: carouselEndPadding }
                : null
            }
            className="w-full"
            style={{ minHeight: CAROUSEL_MIN_HEIGHT }}
          />
        </View>

        {showNavArrows ? (
          <CarouselNavButton
            direction="next"
            accessibilityLabel="Ir al siguiente fondo destacado"
            accessibilityHint="Mueve el carrusel a la tarjeta siguiente"
            onHoverIn={pauseAutoplay}
            onHoverOut={resumeAutoplay}
            onFocus={pauseAutoplay}
            onBlur={resumeAutoplay}
            onPress={goToNext}
          />
        ) : null}
      </View>

      <CarouselControls
        activeIndex={currentIndex}
        count={funds.length}
        counterLabel={(index, count) => `${index + 1} de ${count}`}
        counterAccessibilityLabel={(index, count) =>
          `Fondo destacado ${index + 1} de ${count}`
        }
        previousAccessibilityLabel="Ir al fondo destacado anterior"
        previousAccessibilityHint="Mueve el carrusel a la tarjeta anterior"
        nextAccessibilityLabel="Ir al siguiente fondo destacado"
        nextAccessibilityHint="Mueve el carrusel a la tarjeta siguiente"
        onPrevious={goToPrevious}
        onNext={goToNext}
        onPreviousInteractionStart={pauseAutoplay}
        onPreviousInteractionEnd={resumeAutoplay}
        onNextInteractionStart={pauseAutoplay}
        onNextInteractionEnd={resumeAutoplay}
      />
    </View>
  );
}
