import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

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
  const barHalfHeight = geometry.height / 2;

  const animatedStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 0.08, 1],
      outputRange: [0, 1, 1],
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [barHalfHeight, 0],
        }),
      },
      {
        scaleY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.001, 1],
        }),
      },
    ],
  };

  return (
    <View
      className="justify-end"
      // tailwind-exception: fixed bar slot aligned to shared chart baseline
      style={{ width: barWidth, height: chartHeight }}
    >
      <Animated.View
        className="rounded-t-xs"
        // tailwind-exception: bottom-anchored bar grow animation
        style={[
          {
            width: barWidth,
            height: geometry.height,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

/**
 * Looping upward bar chart used as the Inversora loading indicator.
 */
export function SpinnerBarChart({ size = 'md' }: SpinnerBarChartProps) {
  const theme = useTheme(); // tailwind-exception: chart bar colors with alpha
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
      className="flex-row items-end justify-center"
      // tailwind-exception: chart frame dimensions from spinner constants
      style={{
        width: dimensions.width,
        height: dimensions.height,
        gap: dimensions.gap,
      }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <View
        className="absolute bottom-0 left-0 right-0 h-px rounded-full"
        // tailwind-exception: baseline color with alpha
        style={{ backgroundColor: withAlpha(theme.primary, 0.16) }}
      />
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
