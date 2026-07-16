import { apiGet } from '@/core/api/client';
import {
  allowsMockFallback,
  shouldUseMockData,
} from '@/core/config/app-environment';
import { createInvestmentNewsService } from '@/features/onboarding/services/get-investment-news.factory';

export type { GetInvestmentNewsOptions } from '@/features/onboarding/services/get-investment-news.factory';

/**
 * Returns whether the app should call `GET /news` instead of bundled headlines.
 */
function isNewsApiEnabled(): boolean {
  return process.env.EXPO_PUBLIC_NEWS_API_ENABLED?.trim().toLowerCase() === 'true';
}

const investmentNewsService = createInvestmentNewsService({
  apiGet,
  shouldUseMockData,
  allowsMockFallback,
  isNewsApiEnabled,
});

/**
 * Loads educational investment news from the API without local fallback.
 *
 * @param options - Optional limit and abort signal.
 */
export const fetchInvestmentNews = investmentNewsService.fetchInvestmentNews;

/**
 * Loads educational investment news from the API, with a local fallback for MVP.
 *
 * @param options - Optional limit and abort signal.
 */
export const getInvestmentNews = investmentNewsService.getInvestmentNews;
