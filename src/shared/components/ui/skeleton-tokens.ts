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
    shimmerAccent: theme.skeletonShimmerAccent,
    shimmerShadow: theme.skeletonShimmerShadow,
    shimmerDeep: theme.skeletonShimmerDeep,
  } as const;
}

/** Default shimmer sweep duration in milliseconds. */
export const SKELETON_SHIMMER_DURATION_MS = 1400;
