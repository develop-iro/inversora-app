import type { ComponentProps } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { ApiRankingsMeta, BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import {
  resolveInvestmentThemeLabel,
  type InvestmentTheme,
} from '@/core/domain/investment-theme';
import type { HomeRankingEntry } from '@/features/onboarding/services/resolve-home-search';
import { inferInvestmentThemeFromRankedFund } from '@/features/funds/utils/infer-investment-theme';
import type { RankedFund } from '@/core/scoring/types';

type ThemeIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type RankingThemeOption = {
  readonly id: InvestmentTheme;
  readonly label: string;
  readonly icon: ThemeIconName;
  readonly fundCount: number;
  readonly topScore: number;
};

const THEME_SORT_ORDER: readonly InvestmentTheme[] = [
  'global-equity',
  'us-equity',
  'europe-equity',
  'emerging-equity',
  'fixed-income',
  'multi-asset',
  'technology',
  'esg',
  'sector-other',
  'unclassified',
];

/**
 * Maps a ranking category label to a thematic icon for filter cards.
 */
export function resolveRankingThemeIcon(categoryLabel: string): ThemeIconName {
  const normalized = categoryLabel.toLowerCase();

  if (normalized.includes('usa') || normalized.includes('s&p')) {
    return 'flag';
  }

  if (normalized.includes('europa')) {
    return 'map-marker-radius';
  }

  if (normalized.includes('esg') || normalized.includes('renovable') || normalized.includes('sosten')) {
    return 'leaf';
  }

  if (normalized.includes('tecnolog') || normalized.includes('tech')) {
    return 'chip';
  }

  if (normalized.includes('fija') || normalized.includes('bono') || normalized.includes('bond')) {
    return 'shield-outline';
  }

  if (normalized.includes('mixto') || normalized.includes('multiactivo') || normalized.includes('equilibr')) {
    return 'scale-balance';
  }

  if (normalized.includes('global') || normalized.includes('msci') || normalized.includes('world')) {
    return 'earth';
  }

  if (normalized.includes('emergent') || normalized.includes('sectorial') || normalized.includes('sin clasificar')) {
    return 'chart-line';
  }

  return 'chart-line';
}

/**
 * Shortens API category labels for compact filter cards.
 */
export function formatRankingThemeLabel(categoryLabel: string): string {
  return categoryLabel.replace(/^Índice\s+/i, '').trim();
}

function flattenRankingFunds(groups: readonly BenchmarkRankingGroup[]): RankedFund[] {
  return groups.flatMap((group) => group.funds);
}

function compareThemeOptions(left: RankingThemeOption, right: RankingThemeOption): number {
  const leftIndex = THEME_SORT_ORDER.indexOf(left.id);
  const rightIndex = THEME_SORT_ORDER.indexOf(right.id);

  if (leftIndex !== rightIndex) {
    return leftIndex - rightIndex;
  }

  return left.label.localeCompare(right.label, 'es');
}

/**
 * Builds thematic filter options grouped by investment theme (not benchmark peer group).
 */
export function buildRankingThemeOptionsFromGroups(
  groups: readonly BenchmarkRankingGroup[],
): RankingThemeOption[] {
  const themeTotals = new Map<InvestmentTheme, number>();

  for (const group of groups) {
    const representativeFund = group.funds[0];

    if (!representativeFund) {
      continue;
    }

    const theme = inferInvestmentThemeFromRankedFund(representativeFund);
    themeTotals.set(theme, (themeTotals.get(theme) ?? 0) + group.total);
  }

  return [...themeTotals.entries()]
    .map(([theme, fundCount]) => ({
      id: theme,
      label: resolveInvestmentThemeLabel(theme),
      icon: resolveRankingThemeIcon(resolveInvestmentThemeLabel(theme)),
      fundCount,
      topScore: Math.max(
        ...groups
          .filter((group) => {
            const representativeFund = group.funds[0];
            return (
              representativeFund !== undefined &&
              inferInvestmentThemeFromRankedFund(representativeFund) === theme
            );
          })
          .flatMap((group) => group.funds.map((fund) => fund.score)),
        0,
      ),
    }))
    .sort(compareThemeOptions);
}

/**
 * Resolves how many funds are eligible for public rankings.
 *
 * @param groups - Benchmark groups returned by the API.
 * @param meta - Optional rankings metadata from `GET /rankings`.
 */
export function resolveRankingEligibleFundTotal(
  groups: readonly BenchmarkRankingGroup[],
  meta?: ApiRankingsMeta | null,
): number {
  if (meta?.totalEligibleFunds !== undefined) {
    return meta.totalEligibleFunds;
  }

  return groups.reduce((sum, group) => sum + group.total, 0);
}

/**
 * Returns ranked funds for a benchmark group key, preserving benchmark-local ranks.
 */
export function getRankingFundsForBenchmark(
  groups: readonly BenchmarkRankingGroup[],
  benchmarkKey: string | 'all',
  limit?: number,
): RankedFund[] {
  if (benchmarkKey === 'all') {
    const flattened = flattenRankingFunds(groups);
    return limit === undefined ? flattened : flattened.slice(0, limit);
  }

  const group = groups.find((entry) => entry.benchmarkKey === benchmarkKey);
  const funds = group?.funds ?? [];
  return limit === undefined ? funds : funds.slice(0, limit);
}

/**
 * Returns ranked funds for an investment theme, sorted by score across benchmarks.
 */
export function getRankingFundsForTheme(
  groups: readonly BenchmarkRankingGroup[],
  themeId: InvestmentTheme | 'all',
  limit?: number,
): RankedFund[] {
  if (themeId === 'all') {
    return getRankingFundsForBenchmark(groups, 'all', limit);
  }

  const filtered = flattenRankingFunds(groups).filter(
    (fund) => inferInvestmentThemeFromRankedFund(fund) === themeId,
  );

  const sorted = [...filtered].sort((left, right) => {
    const scoreDifference = right.score - left.score;

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.name.localeCompare(right.name, 'es');
  });

  const ranked = sorted.map((fund, index) => ({
    ...fund,
    rank: index + 1,
  }));

  return limit === undefined ? ranked : ranked.slice(0, limit);
}

/**
 * Maps ranked funds to home ranking rows preserving benchmark-local rank.
 */
export function toHomeRankingEntries(
  funds: readonly RankedFund[],
  highlightedIsin?: string,
): HomeRankingEntry[] {
  return funds.map((fund, index) => ({
    ...fund,
    displayRank: fund.rank,
    isHighlighted: highlightedIsin ? fund.isin === highlightedIsin : index === 0,
  }));
}

/**
 * Builds thematic filter options from a ranked fund list grouped by category label.
 */
export function buildRankingThemeOptions(funds: readonly HomeRankingEntry[]): RankingThemeOption[] {
  const groups = new Map<InvestmentTheme, HomeRankingEntry[]>();

  for (const fund of funds) {
    const theme = inferInvestmentThemeFromRankedFund(fund);
    const existing = groups.get(theme) ?? [];
    existing.push(fund);
    groups.set(theme, existing);
  }

  return [...groups.entries()]
    .map(([theme, entries]) => ({
      id: theme,
      label: resolveInvestmentThemeLabel(theme),
      icon: resolveRankingThemeIcon(resolveInvestmentThemeLabel(theme)),
      fundCount: entries.length,
      topScore: Math.max(...entries.map((entry) => entry.score)),
    }))
    .sort(compareThemeOptions);
}

/**
 * Filters ranking entries by thematic category id.
 */
export function filterRankingByTheme(
  funds: readonly HomeRankingEntry[],
  themeId: InvestmentTheme | 'all',
): HomeRankingEntry[] {
  if (themeId === 'all') {
    return [...funds];
  }

  return funds.filter((fund) => inferInvestmentThemeFromRankedFund(fund) === themeId);
}
