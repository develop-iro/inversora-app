import { Platform, type TextStyle, type ViewStyle } from 'react-native';

import { palette } from '@/shared/theme/palette';

/**
 * Figma: DM Sans (UI) + Nunito (compact labels / chips).
 * Native faces are registered in `src/app/_layout.tsx` via expo-font.
 */
export const FontFamily = {
  display: Platform.select({ web: 'var(--font-display)', default: 'DMSans_400Regular' }),
  displayBold: Platform.select({ web: 'var(--font-display)', default: 'DMSans_700Bold' }),
  accent: Platform.select({ web: 'var(--font-accent)', default: 'Nunito_400Regular' }),
  accentBold: Platform.select({ web: 'var(--font-accent)', default: 'Nunito_800ExtraBold' }),
  mono: Platform.select({
    ios: 'ui-monospace',
    default: 'monospace',
    web: 'var(--font-mono)',
  }),
} as const;

export const Typography = {
  hero: {
    fontFamily: FontFamily.displayBold,
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -0.96,
  },
  sectionTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: 22,
    lineHeight: 29,
    letterSpacing: -0.22,
  },
  navTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontFamily: FontFamily.display,
    fontSize: 17,
    lineHeight: 23,
  },
  bodyBold: {
    fontFamily: FontFamily.displayBold,
    fontSize: 17,
    lineHeight: 22,
  },
  button: {
    fontFamily: FontFamily.displayBold,
    fontSize: 15,
    lineHeight: 20,
  },
  caption: {
    fontFamily: FontFamily.display,
    fontSize: 13,
    lineHeight: 17,
  },
  chip: {
    fontFamily: FontFamily.accentBold,
    fontSize: 13,
    lineHeight: 18,
  },
  cardTitle: {
    fontFamily: FontFamily.accentBold,
    fontSize: 15,
    lineHeight: 20,
  },
  tab: {
    fontFamily: FontFamily.displayBold,
    fontSize: 11,
    lineHeight: 15,
  },
} as const satisfies Record<string, TextStyle>;

export const Spacing = {
  half: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  /** @deprecated Use named scale (xs, sm, lg, …). */
  one: 4,
  /** @deprecated Use named scale. */
  two: 8,
  /** @deprecated Use named scale. */
  three: 16,
  /** @deprecated Use named scale. */
  four: 24,
  /** @deprecated Use named scale. */
  five: 32,
  /** @deprecated Use named scale. */
  six: 64,
} as const;

export const Radius = {
  image: 6,
  card: 12,
  field: 16,
  chip: 16,
  pill: 56,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },
  heroText: {
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
} as const satisfies Record<string, ViewStyle | TextStyle>;

/** Hero header gradient (Primary Teal → Deep Ocean). */
export const Gradients = {
  hero: [palette.primaryTeal, palette.deepOcean] as const,
} as const;

export const Layout = {
  screenPaddingHorizontal: Spacing.lg,
  maxContentWidth: 800,
  bottomTabInset: Platform.select({ ios: 50, android: 80 }) ?? 0,
} as const;
