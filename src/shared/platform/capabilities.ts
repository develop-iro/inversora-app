import { Platform } from 'react-native';

export const PlatformRuntime = Platform.OS as 'web' | 'ios' | 'android';

export const isWeb = Platform.OS === 'web';

export const isNative = !isWeb;

export const BREAKPOINTS = {
  compact: 480,
  desktopHints: 768,
  wideLayout: 1024,
} as const;

export type InfoHintSurface = 'dashboard' | 'catalog' | 'detail';

export function shouldShowInfoHint(surface: InfoHintSurface): boolean {
  return surface !== 'dashboard';
}
