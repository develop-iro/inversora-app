import { useFocusEffect } from 'expo-router';
import { useCallback, type ReactNode } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { TAB_CROSSFADE_MS } from '@/shared/navigation/stack-screen-options';

export type TabScreenTransitionProps = {
  readonly children: ReactNode;
};

/**
 * Subtle cross-fade when a tab screen gains focus. Does not remount children.
 *
 * On web (especially mobile Chrome), forcing opacity to 0 before `withTiming`
 * can leave the scene permanently blank if the animation is interrupted. Keep
 * content fully opaque there and rely on Expo Router’s native tab switch.
 */
export function TabScreenTransition({ children }: TabScreenTransitionProps) {
  const isReducedMotionEnabled = useReducedMotion();
  const opacity = useSharedValue(1);
  const skipFocusFade = Platform.OS === 'web' || isReducedMotionEnabled;

  useFocusEffect(
    useCallback(() => {
      if (skipFocusFade) {
        opacity.value = 1;
        return;
      }

      opacity.value = 0;
      opacity.value = withTiming(1, { duration: TAB_CROSSFADE_MS });
      // Reanimated shared values are stable refs and must not be hook dependencies.
      // eslint-disable-next-line react-hooks/exhaustive-deps -- opacity is a stable SharedValue
    }, [skipFocusFade]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (skipFocusFade) {
    return (
      <Animated.View className="min-h-0 flex-1 overflow-hidden" style={{ opacity: 1 }}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View className="min-h-0 flex-1 overflow-hidden" style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
