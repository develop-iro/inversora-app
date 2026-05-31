import { useEffect } from "react";

import {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

type UseSearchOrbParams = {
  reducedMotionEnabled: boolean;
};

export function useSearchOrb({ reducedMotionEnabled }: UseSearchOrbParams) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reducedMotionEnabled) {
      cancelAnimation(scale);
      scale.value = 1;
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, {
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(scale);
    };
  }, [reducedMotionEnabled, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle };
}
