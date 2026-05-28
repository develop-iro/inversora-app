import { semanticColors, type ThemeColor } from '@/shared/theme/colors';

/**
 * MVP uses the light Figma palette only. Dark semantic tokens exist for later.
 */
export function useTheme() {
  return semanticColors.light;
}

export type { ThemeColor };
