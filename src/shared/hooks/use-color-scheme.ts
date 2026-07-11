import type { ColorSchemeName } from 'react-native';

/**
 * Resolves the active color scheme for theme tokens and navigation chrome.
 * MVP ships with the light educational palette only (`userInterfaceStyle: light`).
 */
export function useColorScheme(): NonNullable<ColorSchemeName> {
  return 'light';
}
