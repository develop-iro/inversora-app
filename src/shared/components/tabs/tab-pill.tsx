import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { TabOption } from '@/shared/components/tabs/tab-option';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useTheme } from '@/shared/hooks/use-theme';
import { withAlpha } from '@/shared/theme/color-utils';
import { getThemeShadows } from '@/shared/theme/shadows';
import { Spacing } from '@/shared/theme/theme';
import { FontFamily, Typography } from '@/shared/theme/tokens';
import { cn } from '@/shared/utils/cn';

const THUMB_ANIMATION_DURATION_MS = 280;
const TRACK_PADDING = 3;
const SEGMENT_GAP = Spacing.xs;

export type { TabOption };

export type TabPillProps<T extends string> = {
  tabs: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  className?: string;
};

type TabPillLabelProps = {
  label: string;
  selected: boolean;
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
 * Computes segment width from measured track width and tab count.
 */
function resolveSegmentWidth(trackWidth: number, tabCount: number): number {
  if (trackWidth <= 0 || tabCount <= 0) {
    return 0;
  }

  return (
    (trackWidth - TRACK_PADDING * 2 - SEGMENT_GAP * (tabCount - 1)) / tabCount
  );
}

/**
 * Computes the horizontal offset for the sliding thumb at the given index.
 */
function resolveThumbOffset(activeIndex: number, segmentWidth: number): number {
  'worklet';

  return activeIndex * (segmentWidth + SEGMENT_GAP);
}

/**
 * Tab label with Uber-style hierarchy: bold dark active, muted regular inactive.
 */
function TabPillLabel({ label, selected }: TabPillLabelProps) {
  const theme = useTheme();

  return (
    <Text
      numberOfLines={1}
      style={[
        styles.label,
        selected ? styles.labelActive : styles.labelInactive,
        { color: selected ? theme.deepOcean : theme.textSecondary },
      ]}
    >
      {label}
    </Text>
  );
}

/**
 * Pill tab switcher with a sliding surface thumb on an inset muted track.
 * Visual pattern follows iOS segmented controls (e.g. Uber Rides/Eats on Mobbin).
 */
export function TabPill<T extends string>({
  tabs,
  value,
  onChange,
  accessibilityLabel = 'Secciones de inicio',
  className,
}: TabPillProps<T>) {
  const theme = useTheme();
  const themeShadows = getThemeShadows(theme);
  const isReducedMotionEnabled = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const previousActiveIndexRef = useRef(resolveActiveIndex(tabs, value));

  const activeIndex = resolveActiveIndex(tabs, value);
  const segmentWidth = resolveSegmentWidth(trackWidth, tabs.length);

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
      className={cn('relative flex-row rounded-full', className)}
      // tailwind-exception: inset track fill + padding for thumb/segment alignment on web
      style={[
        styles.track,
        {
          padding: TRACK_PADDING,
          backgroundColor: withAlpha(theme.text, 0.07),
          borderColor: withAlpha(theme.text, 0.1),
        },
      ]}
      onLayout={handleTrackLayout}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          // tailwind-exception: thumb fill/shadow from theme tokens (Reanimated + web)
          style={[
            styles.thumb,
            themeShadows.segmentSelected,
            {
              width: segmentWidth,
              backgroundColor: theme.surface,
              shadowOpacity: 0.12,
              shadowRadius: 6,
              elevation: 2,
            },
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
            style={[
              segmentWidth > 0
                ? {
                    width: segmentWidth,
                    marginLeft: index > 0 ? SEGMENT_GAP : 0,
                  }
                : styles.segmentFallback,
            ]}
            className={cn(
              'z-[1] min-h-[40px] items-center justify-center rounded-full',
              !selected && 'active:opacity-[0.88]',
            )}
          >
            <TabPillLabel label={tab.label} selected={selected} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    position: 'absolute',
    left: TRACK_PADDING,
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: 9999,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentFallback: {
    flex: 1,
  },
  label: {
    fontSize: Typography.segment.fontSize,
    lineHeight: Typography.segment.lineHeight,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    fontFamily: FontFamily.displayBold,
  },
  labelInactive: {
    fontFamily: FontFamily.display,
  },
});
