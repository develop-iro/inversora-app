import { apiGet } from '@/core/api/client';
import {
  allowsMockFallback,
  shouldUseMockData,
} from '@/core/config/app-environment';
import {
  parseFeaturedFundsResponse,
  type FeaturedFundsResponse,
} from '@/core/api/parse-featured-funds-response';
import type { FeaturedFund } from '@/core/domain/fund';
import { AppError } from '@/core/errors/app-error';
import { FEATURED_FUNDS_MOCK } from '@/features/funds/mocks/featured-funds-mock';
import { getFundsPage } from '@/features/funds/services/get-funds';
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

function resolveCarouselFunds(funds: FeaturedFund[]): FeaturedFund[] {
  const eligible = funds.filter(isBeginnerEligibleFeaturedFund);
  const featuredOnly = eligible.filter((fund) => fund.isFeatured);

  if (featuredOnly.length > 0) {
    return featuredOnly;
  }

  return eligible;
}

/**
 * Fetches featured funds from the API without local fallback.
 *
 * @param options - Optional quarter and filter parameters.
 */
export async function fetchFeaturedFundsForCarousel(
  options?: GetFeaturedFundsOptions,
): Promise<FeaturedFund[]> {
  const response = await getFeaturedFunds(options);
  return resolveCarouselFunds(response.data);
}

export function getFeaturedFundsMockFallback(): FeaturedFund[] {
  return FEATURED_FUNDS_MOCK.filter(
    (fund) => fund.isFeatured && isBeginnerEligibleFeaturedFund(fund),
  );
}

/**
 * Uses top catalog funds when `GET /featured` has no curated selection yet.
 * Keeps home cards aligned with real ISINs so fund detail routes resolve.
 *
 * @param options - Optional abort signal.
 */
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

/**
 * Fetches quarterly featured funds from `GET /featured`.
 *
 * @param options - Optional quarter and filter parameters.
 */
export async function getFeaturedFunds(
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

/**
 * Returns featured fund cards for carousel widgets.
 * Falls back to local mocks when the API is unavailable or empty.
 *
 * @param options - Optional quarter and filter parameters.
 */
export async function getFeaturedFundsForCarousel(
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
