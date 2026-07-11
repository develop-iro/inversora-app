import type { ComponentProps } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { HomeRankingEntry } from '@/features/onboarding/services/resolve-home-search';
import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { RankedFund } from '@/core/scoring/types';

type ThemeIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type RankingThemeOption = {
  readonly id: string;
  readonly label: string;
  readonly icon: ThemeIconName;
  readonly fundCount: number;
  readonly topScore: number;
};

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

  return 'chart-line';
}

/**
 * Shortens API category labels for compact filter cards.
 */
export function formatRankingThemeLabel(categoryLabel: string): string {
  return categoryLabel.replace(/^Índice\s+/i, '').trim();
}

/**
 * Builds thematic filter options from benchmark ranking groups (RN-02).
 */
export function buildRankingThemeOptionsFromGroups(
  groups: readonly BenchmarkRankingGroup[],
): RankingThemeOption[] {
  return groups
    .map((group) => ({
      id: group.benchmarkKey,
      label: group.benchmark,
      icon: resolveRankingThemeIcon(group.benchmark),
      fundCount: group.total,
      topScore: Math.max(...group.funds.map((entry) => entry.score), 0),
    }))
    .sort((left, right) => left.label.localeCompare(right.label, 'es'));
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
    const flattened = groups.flatMap((group) => group.funds);
    return limit === undefined ? flattened : flattened.slice(0, limit);
  }

  const group = groups.find((entry) => entry.benchmarkKey === benchmarkKey);
  const funds = group?.funds ?? [];
  return limit === undefined ? funds : funds.slice(0, limit);
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
  const groups = new Map<string, HomeRankingEntry[]>();

  for (const fund of funds) {
    const existing = groups.get(fund.categoryLabel) ?? [];
    existing.push(fund);
    groups.set(fund.categoryLabel, existing);
  }

  return [...groups.entries()]
    .map(([categoryLabel, entries]) => ({
      id: categoryLabel,
      label: formatRankingThemeLabel(categoryLabel),
      icon: resolveRankingThemeIcon(categoryLabel),
      fundCount: entries.length,
      topScore: Math.max(...entries.map((entry) => entry.score)),
    }))
    .sort((left, right) => left.label.localeCompare(right.label, 'es'));
}

/**
 * Filters ranking entries by thematic category id.
 */
export function filterRankingByTheme(
  funds: readonly HomeRankingEntry[],
  themeId: string | 'all',
): HomeRankingEntry[] {
  if (themeId === 'all') {
    return [...funds];
  }

  return funds.filter((fund) => fund.categoryLabel === themeId);
}
