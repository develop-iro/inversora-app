import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { getLaunchSplashMinimumDisplayMs } from '@/shared/components/brand/app-launch-splash.constants';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';

/** Fade-out duration when reduced motion is off. */
export const LAUNCH_SPLASH_FADE_OUT_MS = 320;

interface UseAppLaunchSplashResult {
  /** Whether the branded overlay should remain mounted. */
  readonly isLaunchSplashVisible: boolean;
  /** Animated opacity for the overlay fade-out. */
  readonly launchSplashOpacity: Animated.Value;
}

/**
 * Controls the post-native branded launch splash: hides the Expo splash once fonts
 * load, keeps the Inversora overlay visible for a minimum duration, then fades out.
 */
export function useAppLaunchSplash(fontsLoaded: boolean): UseAppLaunchSplashResult {
  const reducedMotionEnabled = useReducedMotion();
  const [isLaunchSplashVisible, setIsLaunchSplashVisible] = useState(true);
  const [launchSplashOpacity] = useState(() => new Animated.Value(1));
  const hasStartedDismissRef = useRef(false);

  useEffect(() => {
    if (!fontsLoaded || hasStartedDismissRef.current) {
      return;
    }

    hasStartedDismissRef.current = true;

    void SplashScreen.hideAsync();

    const dismissLaunchSplash = () => {
      if (reducedMotionEnabled) {
        setIsLaunchSplashVisible(false);
        return;
      }

      Animated.timing(launchSplashOpacity, {
        toValue: 0,
        duration: LAUNCH_SPLASH_FADE_OUT_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsLaunchSplashVisible(false);
        }
      });
    };

    const minDisplayMs = reducedMotionEnabled ? 600 : getLaunchSplashMinimumDisplayMs();
    const timer = setTimeout(dismissLaunchSplash, minDisplayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [fontsLoaded, launchSplashOpacity, reducedMotionEnabled]);

  return {
    isLaunchSplashVisible,
    launchSplashOpacity,
  };
}
