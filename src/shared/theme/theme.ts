import { Platform } from 'react-native';

import { FontFamily, Layout } from '@/shared/theme/tokens';

export { palette } from '@/shared/theme/palette';
export type { PaletteColor } from '@/shared/theme/palette';
export { withAlpha } from '@/shared/theme/color-utils';
export { Colors, semanticColors } from '@/shared/theme/colors';
export type { Theme, ThemeColor, ThemeMode } from '@/shared/theme/colors';
export {
  getThemeGradients,
  Gradients,
  type GradientDefinition,
  type GradientLocations,
  type GradientStops,
  type ThemeGradients,
} from '@/shared/theme/gradients';
export {
  getThemeShadows,
  webElevationShadow,
  type ThemeShadows,
  type ThemeShadowStyle,
  type ThemeTextShadowStyle,
} from '@/shared/theme/shadows';
export { ChartMetrics } from '@/shared/theme/chart-metrics';
export {
  FontFamily,
  Layout,
  Radius,
  Shadows,
  SPACING_UNIT,
  Size,
  Spacing,
  Typography,
} from '@/shared/theme/tokens';
export type { SizeToken, SpacingToken, TypographyToken } from '@/shared/theme/tokens';

/** @deprecated Use `FontFamily` from tokens. */
export const Fonts = Platform.select({
  ios: {
    sans: FontFamily.display,
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: FontFamily.mono,
  },
  default: {
    sans: FontFamily.display,
    serif: 'serif',
    rounded: 'normal',
    mono: FontFamily.mono,
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const BottomTabInset = Layout.bottomTabInset;
export const MaxContentWidth = Layout.maxContentWidth;
