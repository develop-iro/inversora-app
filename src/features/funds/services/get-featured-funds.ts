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

export type GetFeaturedFundsOptions = {
  quarter?: string;
  limit?: number;
  benchmark?: string;
  mercado?: string;
  signal?: AbortSignal;
};

function resolveCarouselFunds(funds: FeaturedFund[]): FeaturedFund[] {
  const featuredOnly = funds.filter((fund) => fund.isFeatured);

  if (featuredOnly.length > 0) {
    return featuredOnly;
  }

  return funds;
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
  return FEATURED_FUNDS_MOCK.filter((fund) => fund.isFeatured);
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
  } catch {
    if (allowsMockFallback()) {
      return getFeaturedFundsMockFallback();
    }

    throw new AppError(
      'FUNDS_FETCH_FAILED',
      'No se pudieron cargar los fondos destacados.',
    );
  }

  if (allowsMockFallback()) {
    return getFeaturedFundsMockFallback();
  }

  return [];
}
