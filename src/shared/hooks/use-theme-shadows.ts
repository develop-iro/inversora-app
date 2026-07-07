import { useMemo } from 'react';

import { useTheme } from '@/shared/hooks/use-theme';
import { getThemeShadows } from '@/shared/theme/shadows';

/**
 * Returns elevation and text-shadow presets for the active theme.
 */
export function useThemeShadows() {
  const theme = useTheme();

  return useMemo(() => getThemeShadows(theme), [theme]);
}
