import type { ColorSchemeName } from 'react-native';

/** MVP: ignore `prefers-color-scheme` on web so UI matches Figma light mode. */
export function useColorScheme(): ColorSchemeName {
  return 'light';
}
