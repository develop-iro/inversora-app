import type { TextStyle, ViewStyle } from 'react-native';

import type { Theme } from '@/shared/theme/colors';
import { withAlpha } from '@/shared/theme/color-utils';

export type ThemeShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export type ThemeTextShadowStyle = Pick<
  TextStyle,
  'textShadowColor' | 'textShadowOffset' | 'textShadowRadius'
>;

export type ThemeShadows = {
  readonly card: ThemeShadowStyle;
  readonly heroText: ThemeTextShadowStyle;
  readonly elevated: ThemeShadowStyle;
  readonly focusAura: ThemeShadowStyle;
  readonly tooltip: ThemeShadowStyle;
  readonly segmentSelected: ThemeShadowStyle;
};

/**
 * Returns elevation presets keyed to the active semantic theme.
 */
export function getThemeShadows(theme: Theme): ThemeShadows {
  return {
    card: {
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    heroText: {
      textShadowColor: withAlpha(theme.shadow, 0.08),
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    elevated: {
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.16,
      shadowRadius: 28,
      elevation: 4,
    },
    focusAura: {
      shadowColor: withAlpha(theme.shadow, 0.45),
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 3,
    },
    tooltip: {
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    segmentSelected: {
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
  };
}

/**
 * Builds a CSS `box-shadow` string for web-only surfaces.
 */
export function webElevationShadow(
  theme: Theme,
  options?: { offsetY?: number; blur?: number; opacity?: number },
): string {
  const offsetY = options?.offsetY ?? 10;
  const blur = options?.blur ?? 28;
  const opacity = options?.opacity ?? 0.16;

  return `0 ${offsetY}px ${blur}px ${withAlpha(theme.shadow, opacity)}`;
}
