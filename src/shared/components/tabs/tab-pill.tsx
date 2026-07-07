import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import type { TabOption } from '@/shared/components/tabs/tab-option';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useTheme } from '@/shared/hooks/use-theme';
import { palette } from '@/shared/theme/palette';
import { Radius, Spacing, Typography } from '@/shared/theme/theme';

const THUMB_ANIMATION_DURATION_MS = 280;
const TRACK_PADDING = Spacing.xs;
const SEGMENT_GAP = Spacing.xs;
const THUMB_COLOR = palette.deepOcean;
const INACTIVE_LABEL_COLOR = palette.deepOcean;
const ACTIVE_LABEL_COLOR = palette.white;

export type { TabOption };

export type TabPillProps<T extends string> = {
  tabs: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

type TabPillLabelProps = {
  label: string;
  index: number;
  segmentWidth: number;
  tabCount: number;
  thumbX: SharedValue<number>;
};

/**
 * Resolves the active tab index, defaulting to the first tab when value is unknown.
 */
function resolveActiveIndex<T extends string>(
  tabs: readonly TabOption<T>[],
  value: T,
): number {
  const index = tabs.findIndex((tab) => tab.value === value);

  return index >= 0 ? index : 0;
}

/**
 * Computes the horizontal offset for the sliding thumb at the given index.
 */
function resolveThumbOffset(activeIndex: number, segmentWidth: number): number {
  'worklet';

  return TRACK_PADDING + activeIndex * (segmentWidth + SEGMENT_GAP);
}

/**
 * Builds thumb-position input range and per-segment opacity output for label crossfade.
 */
function buildLabelOpacityRange(
  segmentWidth: number,
  tabCount: number,
  labelIndex: number,
): { inputRange: number[]; outputRange: number[] } {
  'worklet';

  const inputRange = Array.from({ length: tabCount }, (_, index) =>
    resolveThumbOffset(index, segmentWidth),
  );
  const outputRange = inputRange.map((_, index) => (index === labelIndex ? 1 : 0));

  return { inputRange, outputRange };
}

/**
 * Crossfades inactive and active label colors based on sliding thumb position.
 */
function TabPillLabel({
  label,
  index,
  segmentWidth,
  tabCount,
  thumbX,
}: TabPillLabelProps) {
  const inactiveLabelStyle = useAnimatedStyle(() => {
    const { inputRange, outputRange } = buildLabelOpacityRange(
      segmentWidth,
      tabCount,
      index,
    );
    const thumbOverlap = interpolate(
      thumbX.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP,
    );

    return {
      opacity: 1 - thumbOverlap,
    };
  });

  const activeLabelStyle = useAnimatedStyle(() => {
    const { inputRange, outputRange } = buildLabelOpacityRange(
      segmentWidth,
      tabCount,
      index,
    );

    return {
      opacity: interpolate(thumbX.value, inputRange, outputRange, Extrapolation.CLAMP),
    };
  });

  return (
    <View style={styles.labelStack} importantForAccessibility="no-hide-descendants">
      <Animated.Text
        style={[
          styles.segmentLabel,
          { color: INACTIVE_LABEL_COLOR },
          inactiveLabelStyle,
        ]}
      >
        {label}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.segmentLabel,
          styles.labelOnThumb,
          { color: ACTIVE_LABEL_COLOR },
          activeLabelStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
}

/**
 * Pill tab switcher with a sliding filled thumb over a soft track.
 */
export function TabPill<T extends string>({
  tabs,
  value,
  onChange,
  accessibilityLabel = 'Secciones de inicio',
}: TabPillProps<T>) {
  const theme = useTheme();
  const isReducedMotionEnabled = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const previousActiveIndexRef = useRef(resolveActiveIndex(tabs, value));

  const activeIndex = resolveActiveIndex(tabs, value);
  const segmentWidth =
    trackWidth > 0
      ? (trackWidth - TRACK_PADDING * 2 - SEGMENT_GAP * (tabs.length - 1)) / tabs.length
      : 0;

  const thumbX = useSharedValue(0);

  useEffect(() => {
    if (segmentWidth <= 0) {
      return;
    }

    const targetX = resolveThumbOffset(activeIndex, segmentWidth);
    const didActiveIndexChange = previousActiveIndexRef.current !== activeIndex;
    const shouldAnimate =
      !isReducedMotionEnabled && didActiveIndexChange && segmentWidth > 0;

    thumbX.value = shouldAnimate
      ? withTiming(targetX, { duration: THUMB_ANIMATION_DURATION_MS })
      : targetX;

    previousActiveIndexRef.current = activeIndex;
  }, [activeIndex, isReducedMotionEnabled, segmentWidth, thumbX]);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;

    if (nextWidth > 0 && nextWidth !== trackWidth) {
      setTrackWidth(nextWidth);
    }
  };

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: theme.backgroundSoft }]}
      onLayout={handleTrackLayout}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            { width: segmentWidth, backgroundColor: THUMB_COLOR },
            thumbAnimatedStyle,
          ]}
        />
      ) : null}

      {tabs.map((tab, index) => {
        const selected = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
            onPress={() => onChange(tab.value)}
            style={({ pressed }) => [
              styles.segment,
              pressed && !selected && styles.segmentPressed,
            ]}
          >
            {segmentWidth > 0 ? (
              <TabPillLabel
                label={tab.label}
                index={index}
                segmentWidth={segmentWidth}
                tabCount={tabs.length}
                thumbX={thumbX}
              />
            ) : (
              <Text
                style={[
                  styles.segmentLabel,
                  { color: selected ? ACTIVE_LABEL_COLOR : INACTIVE_LABEL_COLOR },
                ]}
              >
                {tab.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: TRACK_PADDING,
    gap: SEGMENT_GAP,
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: 0,
    borderRadius: Radius.full,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    zIndex: 1,
  },
  segmentPressed: {
    opacity: 0.88,
  },
  labelStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelOnThumb: {
    position: 'absolute',
  },
  segmentLabel: {
    ...Typography.segment,
    textAlign: 'center',
  },
});
