import type { ColorSchemeName } from 'react-native';

/** MVP: Figma is light-only until a dark theme is designed. */
export function useColorScheme(): ColorSchemeName {
  return 'light';
}
