import { useEffect, useMemo, useState } from "react";

import {
    Easing,
    cancelAnimation,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type UseAnimatedPlaceholderParams = {
  messages: string[];
  paused: boolean;
  reducedMotionEnabled: boolean;
  intervalMs?: number;
};

export function useAnimatedPlaceholder({
  messages,
  paused,
  reducedMotionEnabled,
  intervalMs = 5000,
}: UseAnimatedPlaceholderParams) {
  const stableMessages = useMemo(
    () => (messages.length > 0 ? messages : ["Search funds"]),
    [messages],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotionEnabled || paused || stableMessages.length <= 1) {
      cancelAnimation(opacity);
      opacity.value = 1;
      return;
    }

    const interval = setInterval(() => {
      opacity.value = withTiming(
        0,
        { duration: 240, easing: Easing.out(Easing.quad) },
        (finished) => {
          if (!finished) {
            return;
          }
          runOnJS(setCurrentIndex)(
            (prev) => (prev + 1) % stableMessages.length,
          );
          opacity.value = withTiming(1, {
            duration: 260,
            easing: Easing.out(Easing.quad),
          });
        },
      );
    }, intervalMs);

    return () => {
      clearInterval(interval);
      cancelAnimation(opacity);
    };
  }, [
    intervalMs,
    opacity,
    paused,
    reducedMotionEnabled,
    stableMessages.length,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {
    currentMessage: stableMessages[currentIndex],
    animatedStyle,
  };
}
