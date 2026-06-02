import type { CatalogFund } from '@/core/domain/catalog';
import type { RiskLevel } from '@/core/domain/fund';

import { CATALOG_FUNDS_MOCK } from '@/features/funds/mocks/catalog-funds-mock';
import { getRankings } from '@/features/funds/services/get-rankings';

export type FundCatalogFilters = {
  query?: string;
  riskLevel?: RiskLevel | 'all';
  categoryLabel?: string | 'all';
  maxTerPercent?: number | null;
  minScore?: number | null;
  idealForBeginnersOnly?: boolean;
};

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

function matchesQuery(fund: CatalogFund, query: string): boolean {
  const haystack = `${fund.name} ${fund.isin} ${fund.categoryLabel}`.toLowerCase();
  return haystack.includes(query);
}

function applyFilters(funds: CatalogFund[], filters?: FundCatalogFilters): CatalogFund[] {
  if (!filters) {
    return funds;
  }

  const query = filters.query ? normalizeQuery(filters.query) : '';

  return funds.filter((fund) => {
    if (query && !matchesQuery(fund, query)) {
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
}

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

/** Returns catalog funds with optional filters, sorted by Inversora score. */
export async function getFunds(filters?: FundCatalogFilters): Promise<CatalogFund[]> {
  const enriched = await withRankingMetadata([...CATALOG_FUNDS_MOCK]);
  const filtered = applyFilters(enriched, filters);

  return filtered.sort((a, b) => b.inversoraScore - a.inversoraScore);
}
