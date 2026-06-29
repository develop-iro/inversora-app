/**
 * Inversora brand primitives.
 * Source: Figma Inversora file + brand color table.
 * @see https://www.figma.com/design/S7oabGJ5AQJh52ITEVaH8G/Inversora
 */
export const palette = {
  primaryTeal: '#00BFA6',
  deepOcean: '#0B2E36',
  softTealBackground: '#EAF8F6',
  mintAccent: '#B8F2E6',
  limeAccent: '#D7FF64',
  /** Accessible teal for chart segments (contrast-safe on light backgrounds). */
  chartInterestTeal: '#0F766E',
  neutralBackground: '#F8FAF9',
  textPrimary: '#111827',
  /** Secondary copy — solid gray for WCAG AA on light surfaces (avoid rgba black). */
  textSecondary: '#475569',
  /** Secondary copy on deepOcean / dark surfaces. */
  textSecondaryOnDark: '#B8C5CA',
  warningSoft: '#FACC15',
  dangerSoft: '#FB7185',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type PaletteColor = keyof typeof palette;
