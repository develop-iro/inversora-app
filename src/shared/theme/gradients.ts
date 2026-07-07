import type { Theme, ThemeMode } from '@/shared/theme/colors';
import { withAlpha } from '@/shared/theme/color-utils';
import { palette } from '@/shared/theme/palette';

/** Color stops accepted by `expo-linear-gradient`. */
export type GradientStops = readonly [string, string, ...string[]];

/** Optional normalized stop positions (0–1). */
export type GradientLocations = readonly [number, number, ...number[]];

/**
 * Describes a linear gradient: stops, optional locations, and axis endpoints.
 */
export type GradientDefinition = {
  readonly colors: GradientStops;
  readonly locations?: GradientLocations;
  readonly start?: { readonly x: number; readonly y: number };
  readonly end?: { readonly x: number; readonly y: number };
};

/**
 * Named gradient presets for product surfaces (hero, charts, search, scroll fades).
 */
export type ThemeGradients = {
  /** Brand band: primary teal → deep ocean. */
  readonly heroBrand: GradientDefinition;
  /** Bottom-heavy scrim over hero photography. */
  readonly heroPhotoOverlay: GradientDefinition;
  /** Fade from illustration into card body on hero slides. */
  readonly heroSlideIllustrationFade: GradientDefinition;
  /** Teal area fill under line charts. */
  readonly chartAreaFill: GradientDefinition;
  /** Horizontal fade hinting scrollable table content. */
  readonly scrollFadeHorizontal: GradientDefinition;
  /** Animated sweep on the search field aurora border. */
  readonly searchAuroraSweep: GradientDefinition;
};

type StaticThemeGradients = Pick<
  ThemeGradients,
  'heroBrand' | 'heroPhotoOverlay' | 'chartAreaFill' | 'searchAuroraSweep'
>;

const lightStaticGradients: StaticThemeGradients = {
  heroBrand: {
    colors: [palette.primaryTeal, palette.deepOcean],
  },
  heroPhotoOverlay: {
    colors: [
      withAlpha(palette.black, 0),
      withAlpha(palette.deepOcean, 0.68),
      withAlpha(palette.deepOcean, 0.94),
    ],
    locations: [0, 0.65, 1],
  },
  chartAreaFill: {
    colors: [withAlpha(palette.primaryTeal, 0.22), withAlpha(palette.primaryTeal, 0.02)],
  },
  searchAuroraSweep: {
    colors: [
      withAlpha(palette.primaryTeal, 0.02),
      withAlpha(palette.primaryTeal, 0.18),
      withAlpha(palette.deepOcean, 0.08),
      withAlpha(palette.primaryTeal, 0.02),
    ],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
};

const darkStaticGradients: StaticThemeGradients = {
  heroBrand: {
    colors: [palette.primaryTeal, palette.deepOcean],
  },
  heroPhotoOverlay: {
    colors: [
      withAlpha(palette.black, 0),
      withAlpha(palette.black, 0.62),
      withAlpha(palette.black, 0.88),
    ],
    locations: [0, 0.65, 1],
  },
  chartAreaFill: {
    colors: [withAlpha(palette.primaryTeal, 0.32), withAlpha(palette.primaryTeal, 0.04)],
  },
  searchAuroraSweep: {
    colors: [
      withAlpha(palette.primaryTeal, 0.04),
      withAlpha(palette.primaryTeal, 0.28),
      withAlpha(palette.white, 0.1),
      withAlpha(palette.primaryTeal, 0.04),
    ],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
};

const staticGradientsByMode = {
  light: lightStaticGradients,
  dark: darkStaticGradients,
} as const satisfies Record<ThemeMode, StaticThemeGradients>;

/**
 * Resolves the full gradient set for the active theme, including tokens that depend
 * on semantic surface colors (`background`, `backgroundSoft`).
 */
export function getThemeGradients(theme: Theme, mode: ThemeMode): ThemeGradients {
  const staticGradients = staticGradientsByMode[mode];

  return {
    ...staticGradients,
    heroSlideIllustrationFade: {
      colors: [withAlpha(theme.backgroundSoft, 0), theme.backgroundSoft],
      locations: [0.35, 1],
    },
    scrollFadeHorizontal: {
      colors: [
        withAlpha(theme.background, 0),
        withAlpha(theme.background, 0.92),
        theme.background,
      ],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
  };
}

/** @deprecated Use `getThemeGradients` — kept for legacy imports. */
export const Gradients = {
  hero: lightStaticGradients.heroBrand.colors,
} as const;
