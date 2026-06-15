import { apiGet } from '@/core/api/client';
import {
  parseFeaturedFundsResponse,
  type FeaturedFundsResponse,
} from '@/core/api/parse-featured-funds-response';
import type { FeaturedFund } from '@/core/domain/fund';

export type GetFeaturedFundsOptions = {
  quarter?: string;
  limit?: number;
  benchmark?: string;
  mercado?: string;
  signal?: AbortSignal;
};

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
 * Returns only featured fund cards for carousel widgets.
 *
 * @param options - Optional quarter and filter parameters.
 */
export async function getFeaturedFundsForCarousel(
  options?: GetFeaturedFundsOptions,
): Promise<FeaturedFund[]> {
  const response = await getFeaturedFunds(options);
  return response.data.filter((fund) => fund.isFeatured);
}
