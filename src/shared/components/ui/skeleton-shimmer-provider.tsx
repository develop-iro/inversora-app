import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing } from 'react-native';

import { SKELETON_SHIMMER_DURATION_MS } from '@/shared/components/ui/skeleton-tokens';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';

type SkeletonShimmerContextValue = {
  progress: Animated.Value;
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
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotionEnabled) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }

    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
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
