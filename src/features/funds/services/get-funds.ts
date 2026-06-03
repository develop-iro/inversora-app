import type { CatalogFund } from '@/core/domain/catalog';
import type { RiskLevel } from '@/core/domain/fund';

import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import { filterCatalogVisible } from '@/features/funds/utils/catalog-visibility';
import { matchesFundSearch } from '@/features/funds/utils/fund-search';
import { getRankings } from '@/features/funds/services/get-rankings';

export type FundCatalogFilters = {
  query?: string;
  riskLevel?: RiskLevel | 'all';
  categoryLabel?: string | 'all';
  maxTerPercent?: number | null;
  minScore?: number | null;
  idealForBeginnersOnly?: boolean;
};

let enrichedCatalogCache: CatalogFund[] | null = null;
let enrichedCatalogPromise: Promise<CatalogFund[]> | null = null;

async function withRankingMetadata(funds: CatalogFund[]): Promise<CatalogFund[]> {
  const rankings = await getRankings();
  const rankByIsin = new Map(rankings.map((entry) => [entry.isin, entry]));

  return funds.map((fund) => {
    const ranked = rankByIsin.get(fund.isin);

    if (!ranked) {
      return fund;
    }

    return {
      ...fund,
      inversoraScore: ranked.score,
      rank: ranked.rank,
      efficiencyScore: ranked.score,
    };
  });
}

/** Loads the visible catalog once and caches ranking metadata for fast client-side search. */
export async function getCatalogFunds(): Promise<CatalogFund[]> {
  if (enrichedCatalogCache) {
    return enrichedCatalogCache;
  }

  enrichedCatalogPromise ??= (async () => {
    const visible = filterCatalogVisible(CATALOG_FUNDS_MOCK);
    const enriched = await withRankingMetadata([...visible]);
    enrichedCatalogCache = enriched;
    return enriched;
  })();

  return enrichedCatalogPromise;
}

/** Synchronous filter for in-memory catalog search (target: well under 500 ms). */
export function filterCatalogFunds(
  funds: CatalogFund[],
  filters?: FundCatalogFilters,
): CatalogFund[] {
  if (!filters) {
    return [...funds].sort((a, b) => b.inversoraScore - a.inversoraScore);
  }

  const query = filters.query?.trim() ?? '';

  const filtered = funds.filter((fund) => {
    if (query && !matchesFundSearch(fund, query)) {
      return false;
    }

    if (filters.riskLevel && filters.riskLevel !== 'all' && fund.riskLevel !== filters.riskLevel) {
      return false;
    }

    if (
      filters.categoryLabel &&
      filters.categoryLabel !== 'all' &&
      fund.categoryLabel !== filters.categoryLabel
    ) {
      return false;
    }

    if (filters.maxTerPercent != null && fund.terPercent > filters.maxTerPercent) {
      return false;
    }

    if (filters.minScore != null && fund.inversoraScore < filters.minScore) {
      return false;
    }

    if (filters.idealForBeginnersOnly && !fund.idealForBeginners) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => b.inversoraScore - a.inversoraScore);
}

/** Returns catalog funds with optional filters, sorted by Inversora score. No login required. */
export async function getFunds(filters?: FundCatalogFilters): Promise<CatalogFund[]> {
  const catalog = await getCatalogFunds();
  return filterCatalogFunds(catalog, filters);
}
