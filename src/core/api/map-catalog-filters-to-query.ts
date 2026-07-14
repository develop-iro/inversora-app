import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import type { InvestmentTheme } from '@/core/domain/investment-theme';
import { parseInvestmentTheme } from '@/core/domain/investment-theme';

export type FundListApiQuery = {
  page?: number;
  limit?: number;
  sortBy: 'score' | 'ter' | 'return1y' | 'return3y' | 'name' | 'aum';
  sortOrder: 'asc' | 'desc';
  q?: string;
  benchmark?: string;
  investmentTheme?: InvestmentTheme;
  maxTer?: number;
  minScore?: number;
  minReturn1y?: number;
  minReturn3y?: number;
  idealForBeginnersOnly?: boolean;
  riskProfile?: 'all' | 'low' | 'medium' | 'high';
};

const CATEGORY_LABEL_PREFIX = 'Índice ';

/**
 * Extracts the benchmark token from a catalog category label.
 *
 * @param categoryLabel - UI category label (e.g. `Índice MSCI World`).
 */
export function extractBenchmarkFromCategoryLabel(categoryLabel: string): string | undefined {
  const trimmed = categoryLabel.trim();

  if (trimmed.length === 0) {
    return undefined;
  }

  if (trimmed.startsWith(CATEGORY_LABEL_PREFIX)) {
    const benchmark = trimmed.slice(CATEGORY_LABEL_PREFIX.length).trim();
    return benchmark.length > 0 ? benchmark : undefined;
  }

  return trimmed;
}

/**
 * Maps catalog UI filters to `GET /funds` query parameters.
 *
 * Risk profiles map to `riskProfile` so SQL applies the same ranges as
 * `GET /funds/catalog-metrics` and the app risk labels.
 *
 * @param filters - Optional catalog filters from the funds screen.
 */
export function mapCatalogFiltersToApiQuery(
  filters?: FundCatalogFilters,
): FundListApiQuery {
  const query: FundListApiQuery = {
    sortBy: filters?.sortBy ?? 'score',
    sortOrder: filters?.sortOrder ?? 'desc',
  };

  if (filters === undefined) {
    return query;
  }

  const trimmedQuery = filters.query?.trim();

  if (trimmedQuery) {
    query.q = trimmedQuery;
  }

  if (filters.categoryLabel && filters.categoryLabel !== 'all') {
    const investmentTheme = parseInvestmentTheme(filters.categoryLabel);

    if (investmentTheme !== null) {
      query.investmentTheme = investmentTheme;
    } else {
      const benchmark = extractBenchmarkFromCategoryLabel(filters.categoryLabel);

      if (benchmark !== undefined) {
        query.benchmark = benchmark;
      }
    }
  }

  if (filters.maxTerPercent != null) {
    query.maxTer = filters.maxTerPercent;
  }

  if (filters.minScore != null) {
    query.minScore = filters.minScore;
  }

  if (filters.idealForBeginnersOnly) {
    query.idealForBeginnersOnly = true;
  }

  if (filters.riskLevel !== undefined && filters.riskLevel !== 'all') {
    query.riskProfile = filters.riskLevel;
  }

  if (filters.minReturnPercent != null) {
    if (filters.returnPeriod === '3y') {
      query.minReturn3y = filters.minReturnPercent;
    } else {
      query.minReturn1y = filters.minReturnPercent;
    }
  }

  return query;
}
