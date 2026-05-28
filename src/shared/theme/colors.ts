import { palette } from '@/shared/theme/palette';

const lightTextSecondary = 'rgba(0, 0, 0, 0.5)';
const lightSurfaceMuted = 'rgba(0, 0, 0, 0.04)';
const lightBorder = 'rgba(0, 0, 0, 0.08)';

const darkTextSecondary = 'rgba(255, 255, 255, 0.6)';
const darkSurfaceMuted = 'rgba(255, 255, 255, 0.08)';
const darkBorder = 'rgba(255, 255, 255, 0.12)';

export const semanticColors = {
  light: {
    primary: palette.primaryTeal,
    deepOcean: palette.deepOcean,
    accentMint: palette.mintAccent,
    accentLime: palette.limeAccent,
    warning: palette.warningSoft,
    danger: palette.dangerSoft,

    background: palette.neutralBackground,
    backgroundSoft: palette.softTealBackground,
    backgroundElement: palette.softTealBackground,
    backgroundSelected: palette.mintAccent,
    surface: palette.white,
    surfaceMuted: lightSurfaceMuted,

    text: palette.textPrimary,
    textSecondary: lightTextSecondary,
    textOnPrimary: palette.white,
    textOnDark: palette.white,

    border: lightBorder,
    tabActive: '#0F172A',
    tabInactive: lightTextSecondary,
  },
  dark: {
    primary: palette.primaryTeal,
    deepOcean: palette.deepOcean,
    accentMint: palette.mintAccent,
    accentLime: palette.limeAccent,
    warning: palette.warningSoft,
    danger: palette.dangerSoft,

    background: palette.deepOcean,
    backgroundSoft: '#0F3D47',
    backgroundElement: '#134652',
    backgroundSelected: '#1A5C68',
    surface: '#0F3D47',
    surfaceMuted: darkSurfaceMuted,

    text: palette.white,
    textSecondary: darkTextSecondary,
    textOnPrimary: palette.textPrimary,
    textOnDark: palette.white,

    border: darkBorder,
    tabActive: palette.white,
    tabInactive: darkTextSecondary,
  },
} as const;

export type ThemeMode = keyof typeof semanticColors;
export type ThemeColor = keyof (typeof semanticColors)['light'];

/** @deprecated Prefer `semanticColors` — kept for existing imports. */
export const Colors = semanticColors;
