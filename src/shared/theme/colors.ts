import { withAlpha } from '@/shared/theme/color-utils';
import { palette } from '@/shared/theme/palette';

const lightSurfaceMuted = withAlpha(palette.black, 0.04);
const lightBorder = withAlpha(palette.black, 0.08);
const lightBorderSubtle = withAlpha(palette.deepOcean, 0.06);

const darkSurfaceMuted = withAlpha(palette.white, 0.08);
const darkBorder = withAlpha(palette.white, 0.12);
const darkBorderSubtle = withAlpha(palette.white, 0.06);

const lightSemanticColors = {
  primary: palette.primaryTeal,
  deepOcean: palette.deepOcean,
  accentMint: palette.mintAccent,
  accentLime: palette.limeAccent,
  chartInterest: palette.chartInterestTeal,
  warning: palette.warningSoft,
  danger: palette.dangerSoft,
  warningMuted: palette.warningMuted,
  dangerMuted: palette.dangerMuted,
  warningOnMuted: palette.deepOcean,
  dangerOnMuted: palette.deepOcean,
  statusBadgeBackground: lightSurfaceMuted,
  warningBadgeLabel: palette.warningStrong,
  dangerBadgeLabel: palette.dangerStrong,
  success: palette.chartInterestTeal,

  background: palette.neutralBackground,
  backgroundSoft: palette.softTealBackground,
  backgroundElement: palette.softTealBackground,
  backgroundSelected: palette.mintAccent,
  surface: palette.white,
  surfaceMuted: lightSurfaceMuted,

  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textOnPrimary: palette.white,
  textOnDark: palette.white,
  textOnDarkMuted: withAlpha(palette.white, 0.78),

  border: lightBorder,
  borderSubtle: lightBorderSubtle,
  tabActive: palette.primaryTeal,
  tabInactive: palette.textSecondary,

  primarySurface: withAlpha(palette.primaryTeal, 0.12),
  primarySurfaceSubtle: withAlpha(palette.primaryTeal, 0.08),
  primaryBorder: withAlpha(palette.primaryTeal, 0.24),
  primaryBorderSubtle: withAlpha(palette.primaryTeal, 0.16),
  primaryBorderFaint: withAlpha(palette.primaryTeal, 0.14),
  primaryIconSurface: withAlpha(palette.primaryTeal, 0.14),
  primaryAccent: withAlpha(palette.primaryTeal, 0.55),

  softTealSurface: withAlpha(palette.softTealBackground, 0.66),
  softTealSurfaceMuted: withAlpha(palette.softTealBackground, 0.55),
  softTealSurfaceFaint: withAlpha(palette.softTealBackground, 0.35),

  accentMintSurface: withAlpha(palette.mintAccent, 0.18),
  accentMintText: palette.mintAccent,

  onPrimarySurface: withAlpha(palette.white, 0.18),
  onPrimarySurfaceStrong: withAlpha(palette.white, 0.8),

  deepOceanSurfaceSubtle: withAlpha(palette.deepOcean, 0.07),

  warningBannerSurface: withAlpha(palette.warningSoft, 0.14),
  warningBannerBorder: withAlpha(palette.warningStrong, 0.35),
  dangerBannerSurface: withAlpha(palette.dangerStrong, 0.08),
  dangerBannerBorder: withAlpha(palette.dangerStrong, 0.25),

  chartAllocationFill: withAlpha(palette.primaryTeal, 0.55),
  chartCrosshair: withAlpha(palette.deepOcean, 0.2),
  carouselDotInactive: withAlpha(palette.primaryTeal, 0.22),

  overlayScrim: withAlpha(palette.deepOcean, 0.68),
  overlayScrimHeavy: withAlpha(palette.deepOcean, 0.94),
  scrim: withAlpha(palette.black, 0.2),
  scrimSubtle: withAlpha(palette.black, 0.22),

  shadow: palette.deepOcean,

  skeletonBone: withAlpha(palette.deepOcean, 0.11),
  skeletonBoneMuted: withAlpha(palette.deepOcean, 0.07),
  skeletonPanelBorder: withAlpha(palette.deepOcean, 0.09),
  skeletonShimmerTransparent: withAlpha(palette.white, 0),
  skeletonShimmerHighlight: withAlpha(palette.white, 0.98),
  skeletonShimmerAccent: withAlpha(palette.mintAccent, 0.85),
  skeletonShimmerShadow: withAlpha(palette.deepOcean, 0.35),
  skeletonShimmerDeep: withAlpha(palette.deepOcean, 0.55),
} as const;

const darkSemanticColors = {
  primary: palette.primaryTeal,
  deepOcean: palette.deepOcean,
  accentMint: palette.mintAccent,
  accentLime: palette.limeAccent,
  chartInterest: palette.chartInterestTeal,
  warning: palette.warningSoft,
  danger: palette.dangerSoft,
  warningMuted: withAlpha(palette.warningSoft, 0.18),
  dangerMuted: withAlpha(palette.dangerSoft, 0.18),
  warningOnMuted: palette.white,
  dangerOnMuted: palette.white,
  statusBadgeBackground: darkSurfaceMuted,
  warningBadgeLabel: palette.warningSoft,
  dangerBadgeLabel: palette.dangerSoft,
  success: palette.chartInterestTeal,

  background: palette.deepOcean,
  backgroundSoft: palette.darkOceanSurface,
  backgroundElement: palette.darkOceanElement,
  backgroundSelected: palette.darkOceanSelected,
  surface: palette.darkOceanSurface,
  surfaceMuted: darkSurfaceMuted,

  text: palette.white,
  textSecondary: palette.textSecondaryOnDark,
  textOnPrimary: palette.textPrimary,
  textOnDark: palette.white,
  textOnDarkMuted: withAlpha(palette.white, 0.78),

  border: darkBorder,
  borderSubtle: darkBorderSubtle,
  tabActive: palette.white,
  tabInactive: palette.textSecondaryOnDark,

  primarySurface: withAlpha(palette.primaryTeal, 0.2),
  primarySurfaceSubtle: withAlpha(palette.primaryTeal, 0.12),
  primaryBorder: withAlpha(palette.primaryTeal, 0.35),
  primaryBorderSubtle: withAlpha(palette.primaryTeal, 0.22),
  primaryBorderFaint: withAlpha(palette.primaryTeal, 0.18),
  primaryIconSurface: withAlpha(palette.primaryTeal, 0.22),
  primaryAccent: withAlpha(palette.primaryTeal, 0.65),

  softTealSurface: withAlpha(palette.primaryTeal, 0.14),
  softTealSurfaceMuted: withAlpha(palette.primaryTeal, 0.1),
  softTealSurfaceFaint: withAlpha(palette.primaryTeal, 0.08),

  accentMintSurface: withAlpha(palette.mintAccent, 0.22),
  accentMintText: palette.mintAccent,

  onPrimarySurface: withAlpha(palette.white, 0.14),
  onPrimarySurfaceStrong: withAlpha(palette.white, 0.72),

  deepOceanSurfaceSubtle: withAlpha(palette.white, 0.08),

  warningBannerSurface: withAlpha(palette.warningSoft, 0.16),
  warningBannerBorder: withAlpha(palette.warningSoft, 0.4),
  dangerBannerSurface: withAlpha(palette.dangerSoft, 0.14),
  dangerBannerBorder: withAlpha(palette.dangerSoft, 0.35),

  chartAllocationFill: withAlpha(palette.primaryTeal, 0.65),
  chartCrosshair: withAlpha(palette.white, 0.22),
  carouselDotInactive: withAlpha(palette.primaryTeal, 0.35),

  overlayScrim: withAlpha(palette.black, 0.55),
  overlayScrimHeavy: withAlpha(palette.black, 0.88),
  scrim: withAlpha(palette.black, 0.45),
  scrimSubtle: withAlpha(palette.black, 0.5),

  shadow: palette.black,

  skeletonBone: withAlpha(palette.white, 0.11),
  skeletonBoneMuted: withAlpha(palette.white, 0.07),
  skeletonPanelBorder: withAlpha(palette.white, 0.09),
  skeletonShimmerTransparent: withAlpha(palette.darkOceanSurface, 0),
  skeletonShimmerHighlight: withAlpha(palette.white, 0.12),
  skeletonShimmerAccent: withAlpha(palette.primaryTeal, 0.35),
  skeletonShimmerShadow: withAlpha(palette.black, 0.45),
  skeletonShimmerDeep: withAlpha(palette.black, 0.65),
} as const;

export const semanticColors = {
  light: lightSemanticColors,
  dark: darkSemanticColors,
} as const;

export type ThemeMode = keyof typeof semanticColors;
export type Theme = (typeof semanticColors)[ThemeMode];
export type ThemeColor = keyof Theme;

/** @deprecated Prefer `semanticColors` — kept for existing imports. */
export const Colors = semanticColors;
