import { Platform } from 'react-native';

import { FontFamily, Layout } from '@/shared/theme/tokens';

export { palette } from '@/shared/theme/palette';
export type { PaletteColor } from '@/shared/theme/palette';
export { Colors, semanticColors } from '@/shared/theme/colors';
export type { ThemeColor, ThemeMode } from '@/shared/theme/colors';
export {
  FontFamily,
  Gradients,
  Layout,
  Radius,
  Shadows,
  Spacing,
  Typography,
} from '@/shared/theme/tokens';

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
