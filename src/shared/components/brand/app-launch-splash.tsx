import { Animated, StyleSheet } from 'react-native';

import { AppLaunchSplashWordmark } from '@/shared/components/brand/app-launch-splash-wordmark';
import { palette } from '@/shared/theme/palette';

interface AppLaunchSplashProps {
  /** Animated opacity driven by {@link useAppLaunchSplash}. */
  readonly opacity: Animated.Value;
}

/**
 * Full-screen branded launch overlay inspired by native bank splash screens:
 * solid brand background with an animated product wordmark centered.
 */
export function AppLaunchSplash({ opacity }: AppLaunchSplashProps) {
  return (
    <Animated.View
      // tailwind-exception: Animated.View does not honor absolute-fill className reliably on web
      style={[styles.overlay, { opacity }]}
      accessibilityRole="image"
      accessibilityLabel="Inversora"
      pointerEvents="none"
    >
      <AppLaunchSplashWordmark />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    backgroundColor: palette.deepOcean,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
