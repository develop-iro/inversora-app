import type { HttpGetPort } from '@/core/api/http-get-port';
import {
  parseFeaturedFundsResponse,
  type FeaturedFundsResponse,
} from '@/core/api/parse-featured-funds-response';
import type { FeaturedFund } from '@/core/domain/fund';
import { AppError } from '@/core/errors/app-error';
import { FEATURED_FUNDS_MOCK } from '@/features/funds/mocks/featured-funds-mock';
import type { FundListResponse } from '@/core/api/parse-fund-list-response';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import { isBeginnerEligibleFeaturedFund } from '@/features/funds/utils/beginner-eligibility';

/** Maximum featured cards shown in the home carousel. */
const FEATURED_CAROUSEL_LIMIT = 4;

export type GetFeaturedFundsOptions = {
  quarter?: string;
  limit?: number;
  benchmark?: string;
  mercado?: string;
  signal?: AbortSignal;
};

/**
 * Dependencies for the featured-funds application service.
 */
export type FeaturedFundsServiceDeps = {
  apiGet: HttpGetPort;
  shouldUseMockData: () => boolean;
  allowsMockFallback: () => boolean;
  getFundsPage: (
    filters: FundCatalogFilters | undefined,
    page: number,
    signal?: AbortSignal,
  ) => Promise<FundListResponse>;
};

function resolveCarouselFunds(funds: FeaturedFund[]): FeaturedFund[] {
  const eligible = funds.filter(isBeginnerEligibleFeaturedFund);
  const featuredOnly = eligible.filter((fund) => fund.isFeatured);

  if (featuredOnly.length > 0) {
    return featuredOnly;
  }

  return eligible;
}

/**
 * Returns curated mock featured funds for carousel fallbacks.
 */
export function getFeaturedFundsMockFallback(): FeaturedFund[] {
  return FEATURED_FUNDS_MOCK.filter(
    (fund) => fund.isFeatured && isBeginnerEligibleFeaturedFund(fund),
  );
}

/**
 * Creates the featured-funds application service without React Native imports.
 *
 * @param deps - HTTP port, environment predicates, and catalog page loader.
 */
export function createFeaturedFundsService(deps: FeaturedFundsServiceDeps) {
  const { apiGet, shouldUseMockData, allowsMockFallback, getFundsPage } = deps;

  async function getFeaturedFunds(
    options?: GetFeaturedFundsOptions,
  ): Promise<FeaturedFundsResponse> {
    const payload = await apiGet<unknown>({
      path: '/featured',
      searchParams: {
        quarter: options?.quarter,
        limit: options?.limit,
        benchmark: options?.benchmark,
        mercado: options?.mercado,
      },
      signal: options?.signal,
    });

    return parseFeaturedFundsResponse(payload);
  }

  async function fetchFeaturedFundsForCarousel(
    options?: GetFeaturedFundsOptions,
  ): Promise<FeaturedFund[]> {
    const response = await getFeaturedFunds(options);
    return resolveCarouselFunds(response.data);
  }

  async function fetchFeaturedFundsFromCatalog(
    options?: Pick<GetFeaturedFundsOptions, 'signal'>,
  ): Promise<FeaturedFund[]> {
    try {
      const response = await getFundsPage(
        { sortBy: 'score', sortOrder: 'desc' },
        1,
        options?.signal,
      );

      return response.data
        .filter(
          (fund) =>
            fund.catalogVisibility !== 'blocked' && fund.isin.trim().length > 0,
        )
        .slice(0, FEATURED_CAROUSEL_LIMIT);
    } catch {
      return [];
    }
  }

  async function getFeaturedFundsForCarousel(
    options?: GetFeaturedFundsOptions,
  ): Promise<FeaturedFund[]> {
    if (shouldUseMockData()) {
      return getFeaturedFundsMockFallback();
    }

    try {
      const response = await getFeaturedFunds(options);
      const resolved = resolveCarouselFunds(response.data);

      if (resolved.length > 0) {
        return resolved;
      }

      const fromCatalog = await fetchFeaturedFundsFromCatalog(options);

      if (fromCatalog.length > 0) {
        return fromCatalog;
      }

      return [];
    } catch {
      if (allowsMockFallback()) {
        return getFeaturedFundsMockFallback();
      }

      throw new AppError(
        'FUNDS_FETCH_FAILED',
        'No se pudieron cargar los fondos destacados.',
      );
    }
  }

  return {
    getFeaturedFunds,
    fetchFeaturedFundsForCarousel,
    getFeaturedFundsForCarousel,
  };
}
