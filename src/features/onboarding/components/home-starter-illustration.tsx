import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import type { HomeStarterCardVariant } from '@/features/onboarding/constants/home-starter-cards';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useTheme } from '@/shared/hooks/use-theme';
import { palette } from '@/shared/theme/palette';
import { withAlpha } from '@/shared/theme/color-utils';

const ILLUSTRATION_SIZE = 104;
const LEARN_FLOAT_MS = 2400;
const RANKING_BAR_STAGGER_MS = 180;
const RANKING_BAR_DURATION_MS = 520;
const RANKING_CYCLE_HOLD_MS = 900;
const RANKING_CYCLE_RESET_MS = 280;

export type HomeStarterIllustrationProps = {
  readonly variant: HomeStarterCardVariant;
  readonly accessibilityLabel: string;
};

type LearnIllustrationProps = {
  readonly float: Animated.Value;
  readonly chartProgress: Animated.Value;
  readonly arrowProgress: Animated.Value;
};

type RankingIllustrationProps = {
  readonly barProgress: readonly Animated.Value[];
  readonly starScale: Animated.Value;
};

/**
 * Animated open-book glyph with a rising trend line for the learn starter card.
 */
function LearnIllustration({ float, chartProgress, arrowProgress }: LearnIllustrationProps) {
  const theme = useTheme();
  const size = ILLUSTRATION_SIZE;
  const bookFill = withAlpha(theme.primary, 0.18);
  const bookStroke = withAlpha(theme.deepOcean, 0.35);
  const accent = theme.primary;
  const leaf = withAlpha(theme.accentMint, 0.95);

  const floatStyle = {
    transform: [
      {
        translateY: float.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -5],
        }),
      },
    ],
  };

  const chartStyle = {
    opacity: chartProgress.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 1, 1],
    }),
    transform: [
      {
        scaleY: chartProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.001, 1],
        }),
      },
    ],
  };

  const arrowStyle = {
    opacity: arrowProgress,
    transform: [
      {
        translateY: arrowProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [6, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={floatStyle}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={22} cy={24} r={5} fill={leaf} />
        <Circle cx={82} cy={28} r={4} fill={withAlpha(theme.primary, 0.28)} />
        <Path
          d={`M${size * 0.18} ${size * 0.72} Q${size * 0.34} ${size * 0.58} ${size * 0.5} ${size * 0.72}`}
          stroke={leaf}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />

        <Rect
          x={size * 0.24}
          y={size * 0.48}
          width={size * 0.52}
          height={size * 0.28}
          rx={8}
          fill={bookFill}
          stroke={bookStroke}
          strokeWidth={1.5}
        />
        <Line
          x1={size * 0.5}
          y1={size * 0.48}
          x2={size * 0.5}
          y2={size * 0.76}
          stroke={bookStroke}
          strokeWidth={1.5}
        />
        <Path
          d={`M${size * 0.3} ${size * 0.58} H${size * 0.44} M${size * 0.56} ${size * 0.58} H${size * 0.7}`}
          stroke={withAlpha(theme.deepOcean, 0.28)}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>

      <Animated.View
        // tailwind-exception: chart overlay anchored above the book spine
        style={[
          {
            position: 'absolute',
            left: size * 0.34,
            top: size * 0.18,
            width: size * 0.42,
            height: size * 0.34,
            transformOrigin: 'bottom center',
          },
          chartStyle,
        ]}
      >
        <Svg width={size * 0.42} height={size * 0.34} viewBox="0 0 44 34">
          <Path
            d="M4 28 L14 20 L24 24 L36 8"
            stroke={accent}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        // tailwind-exception: arrow pulse at the trend peak
        style={[
          {
            position: 'absolute',
            left: size * 0.68,
            top: size * 0.12,
          },
          arrowStyle,
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Path
            d="M8 3 L8 13 M8 3 L4 7 M8 3 L12 7"
            stroke={accent}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/**
 * Animated podium bars and star for the ranking starter card.
 */
function RankingIllustration({ barProgress, starScale }: RankingIllustrationProps) {
  const theme = useTheme();
  const size = ILLUSTRATION_SIZE;
  const bars = [
    { x: size * 0.22, height: size * 0.22, progress: barProgress[0]! },
    { x: size * 0.42, height: size * 0.38, progress: barProgress[1]! },
    { x: size * 0.62, height: size * 0.28, progress: barProgress[2]! },
  ];
  const barWidth = size * 0.14;
  const baseline = size * 0.78;

  const starStyle = {
    transform: [{ scale: starScale }],
  };

  return (
    <View>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Line
          x1={size * 0.16}
          y1={baseline}
          x2={size * 0.84}
          y2={baseline}
          stroke={withAlpha(theme.deepOcean, 0.18)}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Circle cx={size * 0.82} cy={size * 0.24} r={size * 0.11} fill={withAlpha(theme.primary, 0.12)} />
        <Path
          d={`M${size * 0.74} ${size * 0.28} A${size * 0.08} ${size * 0.08} 0 0 1 ${size * 0.9} ${size * 0.28}`}
          stroke={withAlpha(theme.primary, 0.35)}
          strokeWidth={2}
          fill="none"
        />
      </Svg>

      {bars.map((bar, index) => {
        const animatedStyle = {
          opacity: bar.progress.interpolate({
            inputRange: [0, 0.12, 1],
            outputRange: [0, 1, 1],
          }),
          transform: [
            {
              scaleY: bar.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.001, 1],
              }),
            },
          ],
        };

        return (
          <Animated.View
            key={`ranking-bar-${index}`}
            // tailwind-exception: bottom-anchored podium bar grow animation
            style={[
              {
                position: 'absolute',
                left: bar.x,
                top: baseline - bar.height,
                width: barWidth,
                height: bar.height,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                backgroundColor: withAlpha(theme.primary, 0.28 + index * 0.18),
                transformOrigin: 'bottom center',
              },
              animatedStyle,
            ]}
          />
        );
      })}

      <Animated.View
        // tailwind-exception: star pulse above the tallest bar
        style={[
          {
            position: 'absolute',
            left: size * 0.47,
            top: size * 0.16,
          },
          starStyle,
        ]}
      >
        <Svg width={20} height={20} viewBox="0 0 20 20">
          <Path
            d="M10 2.5 L12.1 7.4 L17.4 8.1 L13.4 11.8 L14.4 17 L10 14.3 L5.6 17 L6.6 11.8 L2.6 8.1 L7.9 7.4 Z"
            fill={palette.limeAccent}
            stroke={withAlpha(theme.deepOcean, 0.2)}
            strokeWidth={0.8}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

/**
 * Decorative animated illustration for a home starter card variant.
 */
export function HomeStarterIllustration({ variant, accessibilityLabel }: HomeStarterIllustrationProps) {
  const reducedMotionEnabled = useReducedMotion();
  const [float] = useState(() => new Animated.Value(reducedMotionEnabled ? 0.5 : 0));
  const [chartProgress] = useState(() => new Animated.Value(reducedMotionEnabled ? 1 : 0));
  const [arrowProgress] = useState(() => new Animated.Value(reducedMotionEnabled ? 1 : 0));
  const barProgress = useMemo(
    () => [0, 1, 2].map(() => new Animated.Value(reducedMotionEnabled ? 1 : 0)),
    [reducedMotionEnabled],
  );
  const [starScale] = useState(() => new Animated.Value(reducedMotionEnabled ? 1 : 0.92));

  useEffect(() => {
    if (variant !== 'learn') {
      return;
    }

    if (reducedMotionEnabled) {
      float.setValue(0.5);
      chartProgress.setValue(1);
      arrowProgress.setValue(1);
      return;
    }

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: LEARN_FLOAT_MS / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: LEARN_FLOAT_MS / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const chartLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(chartProgress, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.delay(700),
        Animated.timing(chartProgress, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]),
    );

    const arrowLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(arrowProgress, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.delay(900),
        Animated.timing(arrowProgress, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();
    chartLoop.start();
    arrowLoop.start();

    return () => {
      floatLoop.stop();
      chartLoop.stop();
      arrowLoop.stop();
    };
  }, [arrowProgress, chartProgress, float, reducedMotionEnabled, variant]);

  useEffect(() => {
    if (variant !== 'ranking') {
      return;
    }

    if (reducedMotionEnabled) {
      barProgress.forEach((anim) => {
        anim.setValue(1);
      });
      starScale.setValue(1);
      return;
    }

    const growIn = Animated.stagger(
      RANKING_BAR_STAGGER_MS,
      barProgress.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: RANKING_BAR_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    );

    const reset = Animated.parallel(
      barProgress.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: RANKING_CYCLE_RESET_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    );

    const barsLoop = Animated.loop(
      Animated.sequence([growIn, Animated.delay(RANKING_CYCLE_HOLD_MS), reset]),
    );

    const starLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(starScale, {
          toValue: 1.08,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(starScale, {
          toValue: 0.94,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    barsLoop.start();
    starLoop.start();

    return () => {
      barsLoop.stop();
      starLoop.stop();
    };
  }, [barProgress, reducedMotionEnabled, starScale, variant]);

  const illustration =
    variant === 'learn' ? (
      <LearnIllustration float={float} chartProgress={chartProgress} arrowProgress={arrowProgress} />
    ) : variant === 'ranking' ? (
      <RankingIllustration barProgress={barProgress} starScale={starScale} />
    ) : (() => {
        const exhaustiveCheck: never = variant;
        return exhaustiveCheck;
      })();

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      className="items-center justify-center"
      // tailwind-exception: fixed illustration viewport for starter cards
      style={{ width: ILLUSTRATION_SIZE, height: ILLUSTRATION_SIZE }}
    >
      {illustration}
    </View>
  );
}
