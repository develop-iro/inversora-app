import { createContext, useContext, useEffect, type ReactNode } from 'react';
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { SKELETON_SHIMMER_DURATION_MS } from '@/shared/components/ui/skeleton-tokens';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';

type SkeletonShimmerContextValue = {
  progress: SharedValue<number>;
  reducedMotionEnabled: boolean;
};

const SkeletonShimmerContext = createContext<SkeletonShimmerContextValue | null>(
  null,
);

export type SkeletonShimmerProviderProps = {
  children: ReactNode;
  /** Full sweep cycle duration in milliseconds. */
  durationMs?: number;
};

/**
 * Shares one shimmer sweep animation across nested skeleton bones.
 */
export function SkeletonShimmerProvider({
  children,
  durationMs = SKELETON_SHIMMER_DURATION_MS,
}: SkeletonShimmerProviderProps) {
  const reducedMotionEnabled = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotionEnabled) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration: durationMs,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [durationMs, progress, reducedMotionEnabled]);

  return (
    <SkeletonShimmerContext.Provider value={{ progress, reducedMotionEnabled }}>
      {children}
    </SkeletonShimmerContext.Provider>
  );
}

/**
 * Reads the shared shimmer progress from the nearest provider.
 */
export function useSkeletonShimmerSweep(): SkeletonShimmerContextValue {
  const context = useContext(SkeletonShimmerContext);

  if (!context) {
    throw new Error('useSkeletonShimmerSweep must be used within SkeletonShimmerProvider');
  }

  return context;
}
