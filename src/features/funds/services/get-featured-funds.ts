import { apiGet } from '@/core/api/client';
import {
  allowsMockFallback,
  shouldUseMockData,
} from '@/core/config/app-environment';
import { createFeaturedFundsService } from '@/features/funds/services/get-featured-funds.factory';
import { getFundsPage } from '@/features/funds/services/get-funds';

export {
  getFeaturedFundsMockFallback,
  type GetFeaturedFundsOptions,
} from '@/features/funds/services/get-featured-funds.factory';

const featuredFundsService = createFeaturedFundsService({
  apiGet,
  shouldUseMockData,
  allowsMockFallback,
  getFundsPage,
});

/**
 * Fetches featured funds from the API without local fallback.
 *
 * @param options - Optional quarter and filter parameters.
 */
export const fetchFeaturedFundsForCarousel =
  featuredFundsService.fetchFeaturedFundsForCarousel;

/**
 * Fetches quarterly featured funds from `GET /featured`.
 *
 * @param options - Optional quarter and filter parameters.
 */
export const getFeaturedFunds = featuredFundsService.getFeaturedFunds;

/**
 * Returns featured fund cards for carousel widgets.
 * Falls back to local mocks when the API is unavailable or empty.
 *
 * @param options - Optional quarter and filter parameters.
 */
export const getFeaturedFundsForCarousel =
  featuredFundsService.getFeaturedFundsForCarousel;
