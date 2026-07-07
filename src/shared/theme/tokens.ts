import { Platform, type TextStyle } from "react-native";

import { semanticColors } from "@/shared/theme/colors";
import { Size } from "@/shared/theme/sizes";
import { SPACING_UNIT, Spacing } from "@/shared/theme/spacing";
import { getThemeShadows } from "@/shared/theme/shadows";

export { SPACING_UNIT, Spacing };
export type { SpacingToken } from "@/shared/theme/spacing";
export { Size };
export type { SizeToken } from "@/shared/theme/sizes";

/** * Figma: DM Sans (UI) + Nunito (compact labels / chips).
 * Native faces are registered in `src/app/_layout.tsx` via expo-font.
 */
export const FontFamily = {
  display: Platform.select({
    web: "var(--font-display)",
    default: "DMSans_400Regular",
  }),
  displayBold: Platform.select({
    web: "var(--font-display)",
    default: "DMSans_700Bold",
  }),
  // Alias conservados por compatibilidad: el sistema usa una sola familia (DM Sans).
  accent: Platform.select({
    web: "var(--font-accent)",
    default: "DMSans_400Regular",
  }),
  accentBold: Platform.select({
    web: "var(--font-accent)",
    default: "DMSans_700Bold",
  }),
  mono: Platform.select({
    ios: "ui-monospace",
    default: "monospace",
    web: "var(--font-mono)",
  }),
  /** Serif wordmark used in header, splash, and other brand surfaces. */
  brandSerif: Platform.select({
    ios: "Georgia",
    android: "serif",
    web: "Georgia, Times New Roman, serif",
    default: "serif",
  }),
} as const;

export const Typography = {
  hero: {
    fontFamily: FontFamily.displayBold,
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -1.1,
  },
  sectionTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.2,
  },
  navTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontFamily: FontFamily.display,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: FontFamily.displayBold,
    fontSize: 17,
    lineHeight: 24,
  },
  button: {
    fontFamily: FontFamily.displayBold,
    fontSize: 15,
    lineHeight: 20,
  },
  caption: {
    fontFamily: FontFamily.display,
    fontSize: 13,
    lineHeight: 19,
  },
  metaLabel: {
    fontFamily: FontFamily.displayBold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.88,
    textTransform: "uppercase",
  },
  chip: {
    fontFamily: FontFamily.displayBold,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.16,
  },
  cardTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.36,
  },
  tab: {
    fontFamily: FontFamily.displayBold,
    fontSize: 11,
    lineHeight: 15,
  },
  brandWordmark: {
    fontFamily: FontFamily.brandSerif,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  brandWordmarkSplash: {
    fontFamily: FontFamily.brandSerif,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  brandWordmarkCompact: {
    fontFamily: FontFamily.brandSerif,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  brandSectionTitle: {
    fontFamily: FontFamily.brandSerif,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  code: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
  },
  chartAxis: {
    fontFamily: FontFamily.display,
    fontSize: 10,
    lineHeight: 12,
  },
  chartLabel: {
    fontFamily: FontFamily.displayBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },
  micro: {
    fontFamily: FontFamily.displayBold,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.48,
    textTransform: "uppercase",
  },
  captionDense: {
    fontFamily: FontFamily.display,
    fontSize: 11,
    lineHeight: 14,
  },
  listMeta: {
    fontFamily: FontFamily.display,
    fontSize: 12,
    lineHeight: 16,
  },
  scoreDisplay: {
    fontFamily: FontFamily.displayBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  scoreHero: {
    fontFamily: FontFamily.displayBold,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.24,
  },
  scoreHeroCompact: {
    fontFamily: FontFamily.displayBold,
    fontSize: 26,
    lineHeight: 30,
  },
  tabLabel: {
    fontFamily: FontFamily.display,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
  },
  tabLabelActive: {
    fontFamily: FontFamily.displayBold,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  },
  legal: {
    fontFamily: FontFamily.display,
    fontSize: 12,
    lineHeight: 17,
  },
  segment: {
    fontFamily: FontFamily.displayBold,
    fontSize: 14,
    lineHeight: 18,
  },
  inputNumeric: {
    fontFamily: FontFamily.display,
    fontSize: 16,
    lineHeight: 22,
  },
  iconSymbolSm: {
    fontFamily: FontFamily.displayBold,
    fontSize: 16,
    lineHeight: 18,
  },
  iconSymbolMd: {
    fontFamily: FontFamily.displayBold,
    fontSize: 18,
    lineHeight: 20,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof Typography;

export const Radius = {
  hairline: 1,
  xs: 3,
  tabBar: 28,
  image: 6,
  card: 12,
  field: 16,
  chip: 16,
  pill: 56,
  full: 9999,
} as const;

/** @deprecated Use `getThemeShadows(theme)` or `useThemeShadows()`. Light-theme defaults. */
export const Shadows = getThemeShadows(semanticColors.light);
export const Layout = {
  screenPaddingHorizontal: Spacing.lg,
  maxContentWidth: 760,
  contentSummaryMaxWidth: Size.contentNarrow,
  bottomTabInset: Platform.select({ ios: 50, android: 80 }) ?? 0,
} as const;
