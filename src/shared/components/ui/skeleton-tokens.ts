import type { Theme } from '@/shared/theme/colors';

/**
 * Visual tokens for skeleton loaders (neutral base + pulsing darker tone).
 */
export function getSkeletonTokens(theme: Theme) {
  return {
    base: theme.skeletonBone,
    baseMuted: theme.skeletonBoneMuted,
    panelBackground: theme.surface,
    panelBorder: theme.skeletonPanelBorder,
    /** Slightly darker gray revealed during the loading pulse. */
    pulseDark: theme.skeletonShimmerShadow,
  } as const;
}

/** Full pulse cycle in milliseconds. */
export const SKELETON_SHIMMER_DURATION_MS = 1400;
