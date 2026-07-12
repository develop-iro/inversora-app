import { Spacing } from '@/shared/theme/spacing';

/** Maximum rendered width of the floating tab bar. */
export const TAB_BAR_MAX_WIDTH = 560;

/** Primary tab routes shown in the bottom bar. */
export const TAB_BAR_TAB_COUNT = 5;

/** Per-tab slot width below which labels use compact copy and tighter metrics. */
export const TAB_BAR_COMPACT_SLOT_WIDTH = 72;

/** Screen width below which the bar uses reduced side inset and padding on iOS. */
export const TAB_BAR_NARROW_SCREEN_WIDTH = 420;

export type TabBarPlatform = 'ios' | 'android' | 'web' | 'macos' | 'windows';

const TAB_LABEL_COMPACT = {
  fontSize: 9,
  lineHeight: 12,
  minimumFontScale: 0.75,
} as const;

const TAB_LABEL_DEFAULT = {
  fontSize: 11,
  lineHeight: 16,
  minimumFontScale: 0.85,
} as const;

export type TabBarLayoutMetrics = {
  readonly barWidth: number;
  readonly perTabWidth: number;
  readonly isCompact: boolean;
  readonly sideInset: number;
  readonly horizontalPadding: number;
  readonly labelFontSize: number;
  readonly labelLineHeight: number;
  readonly minimumFontScale: number;
};

/**
 * Resolves responsive tab bar geometry from the current screen width.
 *
 * @param screenWidth - Window width in density-independent pixels.
 * @param platform - Runtime platform for inset and padding rules.
 */
export function resolveTabBarLayoutMetrics(
  screenWidth: number,
  platform: TabBarPlatform,
): TabBarLayoutMetrics {
  const isNarrowScreen =
    platform === 'ios' && screenWidth < TAB_BAR_NARROW_SCREEN_WIDTH;

  const sideInset =
    platform === 'ios'
      ? isNarrowScreen
        ? Spacing.lg
        : 24
      : 18;

  const horizontalPadding =
    platform === 'ios'
      ? isNarrowScreen
        ? Spacing.sm
        : Spacing.lg
      : Spacing.lgPlus;

  const barWidth = Math.min(
    screenWidth - sideInset * 2,
    TAB_BAR_MAX_WIDTH,
  );
  const perTabWidth =
    (barWidth - horizontalPadding * 2) / TAB_BAR_TAB_COUNT;
  const isCompact = perTabWidth < TAB_BAR_COMPACT_SLOT_WIDTH;
  const labelMetrics = isCompact ? TAB_LABEL_COMPACT : TAB_LABEL_DEFAULT;

  return {
    barWidth,
    perTabWidth,
    isCompact,
    sideInset,
    horizontalPadding,
    labelFontSize: labelMetrics.fontSize,
    labelLineHeight: labelMetrics.lineHeight,
    minimumFontScale: labelMetrics.minimumFontScale,
  };
}

/**
 * Picks the tab label shown in the bar for the current layout density.
 *
 * @param fullLabel - Default label copy.
 * @param compactLabel - Shorter copy for narrow tab slots.
 * @param isCompact - Whether compact layout is active.
 */
export function resolveTabBarDisplayLabel(
  fullLabel: string,
  compactLabel: string | undefined,
  isCompact: boolean,
): string {
  if (isCompact && compactLabel) {
    return compactLabel;
  }

  return fullLabel;
}
