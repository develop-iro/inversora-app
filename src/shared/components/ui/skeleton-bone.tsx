import { useMemo } from 'react';
import {
  Animated,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useSkeletonShimmerSweep } from '@/shared/components/ui/skeleton-shimmer-provider';
import {
  getSkeletonTokens,
  SKELETON_SHIMMER_DURATION_MS,
} from '@/shared/components/ui/skeleton-tokens';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useTheme } from '@/shared/hooks/use-theme';
import { isWeb } from '@/shared/platform/capabilities';
import { Radius } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type SkeletonBoneProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

function resolveBorderRadius(height: number, borderRadius?: number): number {
  if (borderRadius !== undefined) {
    return borderRadius;
  }

  return height <= 20 ? height / 2 : Radius.chip;
}

type SkeletonBoneLayoutProps = SkeletonBoneProps & {
  resolvedRadius: number;
};

/**
 * Web: CSS `@keyframes skeleton-bone-pulse` in global.css (RN Animated native driver is unsupported).
 */
function SkeletonBoneWeb({
  width = '100%',
  height = 16,
  className,
  style,
  resolvedRadius,
}: SkeletonBoneLayoutProps) {
  const reducedMotionEnabled = useReducedMotion();

  const webPulseStyle = reducedMotionEnabled
    ? { backgroundColor: 'var(--color-skeleton-bone)' }
    : {
        backgroundColor: 'var(--color-skeleton-bone)',
        // Web-only: pairs with @keyframes skeleton-bone-pulse in global.css
        animationName: 'skeleton-bone-pulse',
        animationDuration: `${SKELETON_SHIMMER_DURATION_MS}ms`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      };

  return (
    <View
      className={cn(
        'overflow-hidden',
        !reducedMotionEnabled && 'skeleton-bone-pulse',
        className,
      )}
      // tailwind-exception: dynamic width, height, border radius, web animation
      style={[
        {
          width,
          height,
          borderRadius: resolvedRadius,
          ...webPulseStyle,
        },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

/**
 * Native: shared Animated opacity loop crossfades base over pulseDark.
 */
function SkeletonBoneNative({
  width = '100%',
  height = 16,
  className,
  style,
  resolvedRadius,
}: SkeletonBoneLayoutProps) {
  const theme = useTheme(); // tailwind-exception: skeleton pulse colors
  const skeletonTokens = useMemo(() => getSkeletonTokens(theme), [theme]);
  const { progress, reducedMotionEnabled } = useSkeletonShimmerSweep();

  const pulseOverlayOpacity = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 1],
      }),
    [progress],
  );

  return (
    <View
      className={cn('overflow-hidden', className)}
      // tailwind-exception: dynamic width, height, and border radius
      style={[{ width, height, borderRadius: resolvedRadius }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <View
        className="absolute inset-0"
        style={{
          borderRadius: resolvedRadius,
          backgroundColor: skeletonTokens.pulseDark,
        }}
      />

      {reducedMotionEnabled ? (
        <View
          className="absolute inset-0"
          style={{
            borderRadius: resolvedRadius,
            backgroundColor: skeletonTokens.base,
          }}
        />
      ) : (
        <Animated.View
          className="absolute inset-0"
          // tailwind-exception: opacity pulse uses native driver on iOS/Android
          style={{
            borderRadius: resolvedRadius,
            backgroundColor: skeletonTokens.base,
            opacity: pulseOverlayOpacity,
          }}
        />
      )}
    </View>
  );
}

/**
 * Animated placeholder block with a visible darker-tone loading pulse.
 */
export function SkeletonBone(props: SkeletonBoneProps) {
  const resolvedRadius = resolveBorderRadius(props.height ?? 16, props.borderRadius);
  const layoutProps: SkeletonBoneLayoutProps = { ...props, resolvedRadius };

  if (isWeb) {
    return <SkeletonBoneWeb {...layoutProps} />;
  }

  return <SkeletonBoneNative {...layoutProps} />;
}
