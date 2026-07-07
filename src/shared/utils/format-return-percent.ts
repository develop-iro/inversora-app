import type { ThemeColor } from '@/shared/theme/colors';

/**
 * Formats a historical return percentage for display.
 *
 * @param value - Return percentage value.
 */
export function formatReturnPercent(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1).replace('.', ',')} %`;
}

/**
 * Returns a theme color token for a historical return value.
 *
 * @param value - Return percentage value.
 */
export function resolveReturnColorToken(value: number): ThemeColor {
  if (value > 0) {
    return 'success';
  }

  if (value < 0) {
    return 'dangerOnMuted';
  }

  return 'text';
}
