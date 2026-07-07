import { useFocusEffect } from 'expo-router';
import { useCallback, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
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
 */
export function TabScreenTransition({ children }: TabScreenTransitionProps) {
  const isReducedMotionEnabled = useReducedMotion();
  const opacity = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      if (isReducedMotionEnabled) {
        return;
      }

      opacity.value = 0;
      opacity.value = withTiming(1, { duration: TAB_CROSSFADE_MS });
    }, [isReducedMotionEnabled]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
