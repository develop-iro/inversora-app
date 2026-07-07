import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { useSkeletonShimmerSweep } from '@/shared/components/ui/skeleton-shimmer-provider';
import { getSkeletonTokens } from '@/shared/components/ui/skeleton-tokens';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius } from '@/shared/theme/theme';

export type SkeletonBoneProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

function resolveBorderRadius(height: number, borderRadius?: number): number {
  if (borderRadius !== undefined) {
    return borderRadius;
  }

  return height <= 20 ? height / 2 : Radius.chip;
}

/**
 * Animated placeholder block with a high-contrast sweeping shimmer.
 */
export function SkeletonBone({
  width = '100%',
  height = 16,
  borderRadius,
  style,
}: SkeletonBoneProps) {
  const theme = useTheme();
  const skeletonTokens = useMemo(() => getSkeletonTokens(theme), [theme]);
  const { progress, reducedMotionEnabled } = useSkeletonShimmerSweep();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const resolvedRadius = resolveBorderRadius(height, borderRadius);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0) {
      setLayoutWidth(nextWidth);
    }
  };

  const streakAnimatedStyle = useAnimatedStyle(() => {
    if (layoutWidth <= 0 || reducedMotionEnabled) {
      return { transform: [{ translateX: 0 }] };
    }

    const streakWidth = layoutWidth * 2;
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-streakWidth, layoutWidth],
    );

    return {
      transform: [{ translateX }],
    };
  }, [layoutWidth, reducedMotionEnabled]);

  return (
    <View
      onLayout={handleLayout}
      style={[styles.shell, { width, height, borderRadius: resolvedRadius }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: resolvedRadius, backgroundColor: skeletonTokens.base },
        ]}
      />

      {layoutWidth > 0 && !reducedMotionEnabled ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.streakTrack,
            {
              width: layoutWidth * 2,
              borderRadius: resolvedRadius,
            },
            streakAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={[
              skeletonTokens.base,
              skeletonTokens.shimmerHighlight,
              skeletonTokens.shimmerAccent,
              skeletonTokens.shimmerDeep,
              skeletonTokens.base,
            ]}
            locations={[0, 0.28, 0.5, 0.72, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.streakGradient}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    position: 'relative',
  },
  streakTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  streakGradient: {
    flex: 1,
    width: '100%',
  },
});
