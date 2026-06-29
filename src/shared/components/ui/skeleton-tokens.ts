/**
 * Visual tokens for skeleton loaders (neutral base + deep-ocean shimmer sweep).
 */
export const skeletonTokens = {
  /** Resting bone fill on light surfaces. */
  base: 'rgba(11, 46, 54, 0.11)',
  /** Slightly lighter bone layer for depth. */
  baseMuted: 'rgba(11, 46, 54, 0.07)',
  /** Panel surface behind grouped skeleton lines. */
  panelBackground: '#FFFFFF',
  panelBorder: 'rgba(11, 46, 54, 0.09)',
  /** Shimmer gradient stops (left → right within the streak). */
  shimmerTransparent: 'rgba(255, 255, 255, 0)',
  shimmerHighlight: 'rgba(255, 255, 255, 0.98)',
  shimmerAccent: 'rgba(184, 242, 230, 0.85)',
  shimmerShadow: 'rgba(11, 46, 54, 0.35)',
  shimmerDeep: 'rgba(11, 46, 54, 0.55)',
} as const;

/** Default shimmer sweep duration in milliseconds. */
export const SKELETON_SHIMMER_DURATION_MS = 1400;
