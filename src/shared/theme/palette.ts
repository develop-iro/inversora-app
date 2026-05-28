/**
 * Invesora brand primitives.
 * Source: Figma Invesora file + brand color table.
 * @see https://www.figma.com/design/S7oabGJ5AQJh52ITEVaH8G/Invesora
 */
export const palette = {
  primaryTeal: '#00BFA6',
  deepOcean: '#0B2E36',
  softTealBackground: '#EAF8F6',
  mintAccent: '#B8F2E6',
  limeAccent: '#D7FF64',
  neutralBackground: '#F8FAF9',
  textPrimary: '#111827',
  warningSoft: '#FACC15',
  dangerSoft: '#FB7185',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type PaletteColor = keyof typeof palette;
