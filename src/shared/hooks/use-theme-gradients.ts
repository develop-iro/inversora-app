import { useMemo } from 'react';

import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { useTheme } from '@/shared/hooks/use-theme';
import { getThemeGradients } from '@/shared/theme/gradients';

/**
 * Returns named linear-gradient presets for the active color scheme.
 */
export function useThemeGradients() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';

  return useMemo(() => getThemeGradients(theme, mode), [mode, theme]);
}
