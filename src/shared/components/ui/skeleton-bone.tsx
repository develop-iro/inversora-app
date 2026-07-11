import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useSkeletonShimmerSweep } from '@/shared/components/ui/skeleton-shimmer-provider';
import { getSkeletonShimmerGradient, getSkeletonTokens } from '@/shared/components/ui/skeleton-tokens';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type SkeletonBoneProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const SHIMMER_STREAK_WIDTH_RATIO = 0.5;
const MIN_SHIMMER_STREAK_WIDTH = 40;

function resolveBorderRadius(height: number, borderRadius?: number): number {
  if (borderRadius !== undefined) {
    return borderRadius;
  }

  return height <= 20 ? height / 2 : Radius.chip;
}

function resolveShimmerStreakWidth(layoutWidth: number): number {
  return Math.max(layoutWidth * SHIMMER_STREAK_WIDTH_RATIO, MIN_SHIMMER_STREAK_WIDTH);
}

/**
 * Animated placeholder block with a sweeping shimmer highlight.
 */
export function SkeletonBone({
  width = '100%',
  height = 16,
  borderRadius,
  className,
  style,
}: SkeletonBoneProps) {
  const theme = useTheme(); // tailwind-exception: skeleton shimmer gradient colors
  const skeletonTokens = useMemo(() => getSkeletonTokens(theme), [theme]);
  const shimmerGradient = useMemo(() => getSkeletonShimmerGradient(theme), [theme]);
  const { progress, reducedMotionEnabled } = useSkeletonShimmerSweep();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const resolvedRadius = resolveBorderRadius(height, borderRadius);
  const shimmerStreakWidth = resolveShimmerStreakWidth(layoutWidth);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && nextWidth !== layoutWidth) {
      setLayoutWidth(nextWidth);
    }
  };

  const shimmerTranslateX = useMemo(() => {
    if (layoutWidth <= 0) {
      return progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0],
      });
    }

    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-shimmerStreakWidth, layoutWidth],
    });
  }, [layoutWidth, progress, shimmerStreakWidth]);

  const showShimmer = layoutWidth > 0 && !reducedMotionEnabled;

  return (
    <View
      onLayout={handleLayout}
      className={cn('relative overflow-hidden', className)}
      // tailwind-exception: dynamic width, height, and border radius
      style={[{ width, height, borderRadius: resolvedRadius }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <View
        className="absolute inset-0"
        style={{ borderRadius: resolvedRadius, backgroundColor: skeletonTokens.base }}
      />

      {showShimmer ? (
        <Animated.View
          pointerEvents="none"
          // tailwind-exception: shimmer sweep uses native-driver transform
          style={[
            styles.shimmerStreak,
            {
              width: shimmerStreakWidth,
              borderRadius: resolvedRadius,
              transform: [{ translateX: shimmerTranslateX }],
            },
          ]}
        >
          <LinearGradient
            colors={[...shimmerGradient.colors]}
            locations={[...shimmerGradient.locations]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            // tailwind-exception: gradient must fill the animated streak
            style={styles.shimmerGradient}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shimmerStreak: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  shimmerGradient: {
    flex: 1,
  },
});
