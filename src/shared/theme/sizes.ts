/**
 * Fixed layout dimensions (icons, touch targets, card min sizes).
 * Prefer {@link Spacing} for padding, margin, and gap.
 */
export const Size = {
  headerActionIcon: 34,
  headerActionGlyph: 17,
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconSlot: 28,
  iconLg: 32,
  iconXl: 40,
  iconBrand: 36,
  iconXxl: 48,
  touchTarget: 44,
  badgeMinHeight: 28,
  rankBadge: 37,
  scoreBlockMin: 88,
  rankingRowMin: 96,
  tabBarItemMin: 64,
  buttonSmMin: 40,
  buttonMdMin: 48,
  contentNarrow: 620,
  chartYAxis: 28,
  chartBarValue: 14,
  legendSwatch: 12,
} as const;

export type SizeToken = keyof typeof Size;
