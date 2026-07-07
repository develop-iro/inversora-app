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
  headerShown: false,
  animation: STACK_PUSH_ANIMATION,
  gestureEnabled: true,
} as const;

/**
 * Learn / legal: modal sheet on iOS, slide from bottom on Android, fade on web.
 */
export const ROOT_FLOW_SCREEN_OPTIONS = {
  headerShown: false,
  gestureEnabled: true,
  ...Platform.select({
    ios: {
      presentation: 'modal' satisfies NativeStackPresentation,
      animation: 'default' satisfies NativeStackAnimation,
    },
    android: {
      presentation: 'card' satisfies NativeStackPresentation,
      animation: 'slide_from_bottom' satisfies NativeStackAnimation,
    },
    default: {
      presentation: 'card' satisfies NativeStackPresentation,
      animation: 'fade' satisfies NativeStackAnimation,
    },
  }),
} as const;
