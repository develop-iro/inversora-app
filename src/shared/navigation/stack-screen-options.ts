import { Platform } from 'react-native';

type NativeStackAnimation = 'default' | 'fade' | 'slide_from_bottom' | 'slide_from_right' | 'none';
type NativeStackPresentation = 'card' | 'modal' | 'transparentModal' | 'containedModal' | 'fullScreenModal';

/**
 * Default push/pop animation for native stack screens (root flows and fund detail).
 * Web uses a short fade because native stack transitions are limited on web.
 */
export const STACK_PUSH_ANIMATION: NativeStackAnimation = Platform.select({
  ios: 'default',
  android: 'slide_from_right',
  default: 'fade',
}) ?? 'default';

/** Duration for tab cross-fade when switching bottom tabs. */
export const TAB_CROSSFADE_MS = 220;

/** Shared stack options for full-screen routes pushed above the tab shell. */
export const ROOT_STACK_SCREEN_OPTIONS = {
  headerShown: false as const,
  animation: STACK_PUSH_ANIMATION,
  gestureEnabled: true as const,
};

/**
 * Learn / legal: modal sheet on iOS, slide from bottom on Android, fade on web.
 */
function createRootFlowScreenOptions(): {
  headerShown: false;
  gestureEnabled: true;
  presentation: NativeStackPresentation;
  animation: NativeStackAnimation;
} {
  return (
    Platform.select({
      ios: {
        headerShown: false as const,
        gestureEnabled: true as const,
        presentation: 'modal' as const,
        animation: 'default' as const,
      },
      android: {
        headerShown: false as const,
        gestureEnabled: true as const,
        presentation: 'card' as const,
        animation: 'slide_from_bottom' as const,
      },
      default: {
        headerShown: false as const,
        gestureEnabled: true as const,
        presentation: 'card' as const,
        animation: 'fade' as const,
      },
    }) ?? {
      headerShown: false as const,
      gestureEnabled: true as const,
      presentation: 'card' as const,
      animation: 'fade' as const,
    }
  );
}

export const ROOT_FLOW_SCREEN_OPTIONS = createRootFlowScreenOptions();
