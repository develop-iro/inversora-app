import { apiGet } from '@/core/api/client';
import {
  allowsMockFallback,
  shouldUseMockData,
} from '@/core/config/app-environment';
import { parseInvestmentNewsResponse } from '@/core/api/parse-investment-news-response';
import { AppError } from '@/core/errors/app-error';
import type { InvestmentNewsItem } from '@/core/domain/investment-news';
import { HOME_INVESTMENT_NEWS_MOCK } from '@/features/onboarding/mocks/home-investment-news-mock';

export type GetInvestmentNewsOptions = {
  limit?: number;
  signal?: AbortSignal;
};

/**
 * Returns whether the app should call `GET /news` instead of bundled headlines.
 */
function isNewsApiEnabled(): boolean {
  return process.env.EXPO_PUBLIC_NEWS_API_ENABLED?.trim().toLowerCase() === 'true';
}

function sliceNewsMock(limit: number): InvestmentNewsItem[] {
  return [...HOME_INVESTMENT_NEWS_MOCK].slice(0, limit);
}

function shouldUseNewsMockFallback(error: unknown): boolean {
  if (allowsMockFallback()) {
    return true;
  }

  return error instanceof AppError && error.status === 404;
}
/**
 * Loads educational investment news from the API without local fallback.
 *
 * @param options - Optional limit and abort signal.
 */
export async function fetchInvestmentNews(
  options?: GetInvestmentNewsOptions,
): Promise<InvestmentNewsItem[]> {
  const { limit = 4, signal } = options ?? {};

  const payload = await apiGet<unknown>({
    path: '/news',
    searchParams: { limit },
    signal,
  });

  return parseInvestmentNewsResponse(payload).slice(0, limit);
}

/**
 * Loads educational investment news from the API, with a local fallback for MVP.
 *
 * @param options - Optional limit and abort signal.
 */
export async function getInvestmentNews(
  options?: GetInvestmentNewsOptions,
): Promise<InvestmentNewsItem[]> {
  const { limit = 4, signal } = options ?? {};

  if (shouldUseMockData() || !isNewsApiEnabled()) {
    return sliceNewsMock(limit);
  }

  try {
    const payload = await apiGet<unknown>({
      path: '/news',
      searchParams: { limit },
      signal,
    });

    return parseInvestmentNewsResponse(payload).slice(0, limit);
  } catch (error) {
    if (shouldUseNewsMockFallback(error)) {
      return sliceNewsMock(limit);
    }

    throw error;
  }
}