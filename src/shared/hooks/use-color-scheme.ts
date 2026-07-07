import { useColorScheme as useDeviceColorScheme, type ColorSchemeName } from 'react-native';

/**
 * Resolves the active color scheme from the device, defaulting to light.
 */
export function useColorScheme(): NonNullable<ColorSchemeName> {
  return useDeviceColorScheme() ?? 'light';
}
