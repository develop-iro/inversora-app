import { useEffect } from "react";

import {
    Easing,
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

type UseAuroraBorderParams = {
  focused: boolean;
  paused: boolean;
  reducedMotionEnabled: boolean;
};

export function useAuroraBorder({
  focused,
  paused,
  reducedMotionEnabled,
}: UseAuroraBorderParams) {
  const travel = useSharedValue(0);
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotionEnabled) {
      focusProgress.value = focused ? 1 : 0;
      return;
    }

    focusProgress.value = withTiming(focused ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.quad),
    });
  }, [focusProgress, focused, reducedMotionEnabled]);

  useEffect(() => {
    if (reducedMotionEnabled || paused) {
      cancelAnimation(travel);
      return;
    }

    travel.value = withRepeat(
      withTiming(1, {
        duration: 9000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );

    return () => {
      cancelAnimation(travel);
    };
  }, [paused, reducedMotionEnabled, travel]);

  const auraStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(travel.value, [0, 1], [-26, 26]),
      },
    ],
    opacity: interpolate(focusProgress.value, [0, 1], [0.26, 0.42]),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    paddingVertical: interpolate(focusProgress.value, [0, 1], [6, 7]),
  }));

  return {
    auraStyle,
    containerStyle,
  };
}
