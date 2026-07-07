import { DefaultTheme } from 'expo-router';
import { useMemo } from 'react';

import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { semanticColors } from '@/shared/theme/colors';

/**
 * Aligns React Navigation theme colors with Inversora semantic tokens.
 */
export function useNavigationTheme() {
  const colorScheme = useColorScheme();
  const theme = semanticColors[colorScheme === 'dark' ? 'dark' : 'light'];

  return useMemo(
    () => ({
      ...DefaultTheme,
      dark: colorScheme === 'dark',
      colors: {
        ...DefaultTheme.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.surface,
        text: theme.text,
        border: theme.border,
        notification: theme.primary,
      },
    }),
    [colorScheme, theme.background, theme.border, theme.primary, theme.surface, theme.text],
  );
}
