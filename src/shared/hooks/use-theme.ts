import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { semanticColors, type Theme, type ThemeColor } from '@/shared/theme/colors';

/**
 * Returns semantic theme tokens for the active color scheme.
 */
export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  return semanticColors[colorScheme === 'dark' ? 'dark' : 'light'];
}

export type { Theme, ThemeColor };
