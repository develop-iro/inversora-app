import type { Theme } from '@/shared/theme/colors';

/**
 * Visual tokens for skeleton loaders (neutral base + shimmer sweep).
 */
export function getSkeletonTokens(theme: Theme) {
  return {
    base: theme.skeletonBone,
    baseMuted: theme.skeletonBoneMuted,
    panelBackground: theme.surface,
    panelBorder: theme.skeletonPanelBorder,
    shimmerTransparent: theme.skeletonShimmerTransparent,
    shimmerHighlight: theme.skeletonShimmerHighlight,
    shimmerSoft: theme.skeletonShimmerAccent,
    shimmerMid: theme.skeletonShimmerShadow,
    shimmerDeep: theme.skeletonShimmerDeep,
  } as const;
}

/** Default shimmer sweep duration in milliseconds. */
export const SKELETON_SHIMMER_DURATION_MS = 1200;

const SKELETON_SHIMMER_LOCATIONS = [0, 0.22, 0.42, 0.5, 0.58, 0.78, 1] as const;

/**
 * Shared neutral shimmer gradient (transparent → grays → white → grays → transparent).
 * Used by every {@link SkeletonBone} so loading placeholders stay brand-agnostic.
 */
export function getSkeletonShimmerGradient(theme: Theme) {
  const tokens = getSkeletonTokens(theme);

  return {
    colors: [
      tokens.shimmerTransparent,
      tokens.shimmerMid,
      tokens.shimmerSoft,
      tokens.shimmerHighlight,
      tokens.shimmerSoft,
      tokens.shimmerDeep,
      tokens.shimmerTransparent,
    ],
    locations: [...SKELETON_SHIMMER_LOCATIONS],
  } as const;
}
