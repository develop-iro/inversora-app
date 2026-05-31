import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotion() {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setIsReducedMotionEnabled(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        setIsReducedMotionEnabled(enabled);
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return isReducedMotionEnabled;
}
