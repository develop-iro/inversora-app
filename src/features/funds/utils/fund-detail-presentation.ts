import type { FundDetail } from '@/core/domain/catalog';
import type {
  ExposureTabId,
  FundDetailProfile,
  RatioHorizon,
} from '@/core/domain/fund-detail-profile';

const EMPTY_VALUE = '—';

/**
 * Returns whether a formatted profile value represents missing data.
 *
 * @param value - Display string from the BFF payload.
 */
export function isMissingProfileValue(value: string): boolean {
  const trimmed = value.trim();

  return trimmed.length === 0 || trimmed === EMPTY_VALUE;
}

/**
 * Returns whether a ratio row contains a usable numeric value.
 *
 * @param value - Formatted ratio string from the BFF payload.
 */
export function hasRatioValue(value: string): boolean {
  return !isMissingProfileValue(value);
}

/**
 * Returns whether any ratio horizon exposes at least one populated row.
 *
 * @param profile - Fund detail profile block.
 */
export function hasAnyRatioData(profile: FundDetailProfile): boolean {
  const horizons: RatioHorizon[] = ['12m', '3y', '5y'];

  return horizons.some((horizon) =>
    profile.ratiosByHorizon[horizon].some((row) => hasRatioValue(row.value)),
  );
}

/**
 * Returns whether the selected returns view has at least one populated value.
 *
 * @param profile - Fund detail profile block.
 * @param mode - Returns tab mode.
 */
export function hasReturnData(
  profile: FundDetailProfile,
  mode: 'periods' | 'years',
): boolean {
  if (mode === 'periods') {
    return profile.returnsByPeriod.some((item) => item.percent != null);
  }

  return profile.returnsByYear.some((item) => item.percent != null);
}

/**
 * Returns exposure tabs that contain at least one allocation slice.
 *
 * @param profile - Fund detail profile block.
 */
export function getExposureTabsWithData(
  profile: FundDetailProfile,
): ExposureTabId[] {
  const tabIds: ExposureTabId[] = [
    'sectorial',
    'regional',
    'assetAllocation',
    'capitalization',
    'portfolio',
  ];

  return tabIds.filter((tabId) => profile.exposureByTab[tabId].length > 0);
}

/**
 * Returns whether the market regions summary should be rendered.
 *
 * @param detail - Aggregated fund detail payload.
 */
export function shouldShowRegionSummary(detail: FundDetail): boolean {
  return detail.market.regions.length > 0;
}

/**
 * Limits region metrics to an even count so the two-column grid does not leave a blank cell.
 *
 * @param detail - Aggregated fund detail payload.
 */
export function getRegionMetricsForGrid(detail: FundDetail): {
  id: string;
  label: string;
  value: string;
}[] {
  const metrics = detail.market.regions.map((region) => ({
    id: region.label,
    label: region.label,
    value: `${region.percent}%`,
  }));

  if (metrics.length <= 1) {
    return metrics;
  }

  if (metrics.length % 2 === 0) {
    return metrics;
  }

  return metrics.slice(0, metrics.length - 1);
}
