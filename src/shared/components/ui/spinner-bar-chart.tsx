import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import {
  SPINNER_BAR_DURATION_MS,
  SPINNER_BAR_STAGGER_MS,
  SPINNER_BAR_VALUES,
  SPINNER_CHART_DIMENSIONS,
  SPINNER_CYCLE_HOLD_MS,
  SPINNER_CYCLE_RESET_MS,
  type SpinnerSize,
} from '@/shared/components/ui/spinner.constants';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useTheme } from '@/shared/hooks/use-theme';
import { withAlpha } from '@/shared/theme/color-utils';
import { Radius } from '@/shared/theme/theme';

export type SpinnerBarChartProps = {
  readonly size?: SpinnerSize;
};

type BarGeometry = {
  readonly height: number;
};

type SpinnerBarProps = {
  readonly geometry: BarGeometry;
  readonly progress: Animated.Value;
  readonly chartHeight: number;
  readonly barWidth: number;
  readonly color: string;
};

/**
 * Single vertical bar with bottom-anchored grow-in.
 */
function SpinnerBar({ geometry, progress, chartHeight, barWidth, color }: SpinnerBarProps) {
  const animatedStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 1, 1],
    }),
    transform: [
      { translateY: chartHeight },
      {
        scaleY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.06, 1],
        }),
      },
      { translateY: -chartHeight },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.barSlot,
        { width: barWidth, height: chartHeight },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            height: geometry.height,
            width: barWidth,
            backgroundColor: color,
          },
        ]}
      />
    </Animated.View>
  );
}

/**
 * Looping upward bar chart used as the Inversora loading indicator.
 */
export function SpinnerBarChart({ size = 'md' }: SpinnerBarChartProps) {
  const theme = useTheme();
  const reducedMotionEnabled = useReducedMotion();
  const dimensions = SPINNER_CHART_DIMENSIONS[size];
  const barGeometries = useMemo(
    () =>
      SPINNER_BAR_VALUES.map((value) => ({
        height: Math.max(value * dimensions.height, 3),
      })),
    [dimensions.height],
  );
  const [barAnims] = useState(() =>
    SPINNER_BAR_VALUES.map(() => new Animated.Value(reducedMotionEnabled ? 1 : 0)),
  );

  useEffect(() => {
    if (reducedMotionEnabled) {
      barAnims.forEach((anim) => {
        anim.setValue(1);
      });
      return;
    }

    const growIn = Animated.stagger(
      SPINNER_BAR_STAGGER_MS,
      barAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: SPINNER_BAR_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    );

    const reset = Animated.parallel(
      barAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: SPINNER_CYCLE_RESET_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    );

    const loop = Animated.loop(
      Animated.sequence([
        growIn,
        Animated.delay(SPINNER_CYCLE_HOLD_MS),
        reset,
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [barAnims, reducedMotionEnabled]);

  return (
    <View
      style={[
        styles.chartFrame,
        {
          width: dimensions.width,
          height: dimensions.height,
          gap: dimensions.gap,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <View style={[styles.baseline, { backgroundColor: withAlpha(theme.primary, 0.16) }]} />
      {barGeometries.map((geometry, index) => {
        const value = SPINNER_BAR_VALUES[index] ?? 0.5;
        const barColor = withAlpha(theme.primary, 0.42 + value * 0.58);

        return (
          <SpinnerBar
            key={`spinner-bar-${index}`}
            geometry={geometry}
            progress={barAnims[index]!}
            chartHeight={dimensions.height}
            barWidth={dimensions.barWidth}
            color={barColor}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chartFrame: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  baseline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    borderRadius: Radius.full,
  },
  barSlot: {
    justifyContent: 'flex-end',
  },
  bar: {
    borderTopLeftRadius: Radius.xs,
    borderTopRightRadius: Radius.xs,
  },
});
