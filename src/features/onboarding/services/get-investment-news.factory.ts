import type { HttpGetPort } from '@/core/api/http-get-port';
import { parseInvestmentNewsResponse } from '@/core/api/parse-investment-news-response';
import { AppError } from '@/core/errors/app-error';
import type { InvestmentNewsItem } from '@/core/domain/investment-news';
import { HOME_INVESTMENT_NEWS_MOCK } from '@/features/onboarding/mocks/home-investment-news-mock';

export type GetInvestmentNewsOptions = {
  limit?: number;
  signal?: AbortSignal;
};

/**
 * Dependencies for the investment-news application service.
 */
export type InvestmentNewsServiceDeps = {
  apiGet: HttpGetPort;
  shouldUseMockData: () => boolean;
  allowsMockFallback: () => boolean;
  /** When false, the service returns bundled educational headlines. */
  isNewsApiEnabled: () => boolean;
};

function sliceNewsMock(limit: number): InvestmentNewsItem[] {
  return [...HOME_INVESTMENT_NEWS_MOCK].slice(0, limit);
}

/**
 * Creates the investment-news application service without React Native imports.
 *
 * @param deps - HTTP port and environment predicates.
 */
export function createInvestmentNewsService(deps: InvestmentNewsServiceDeps) {
  const { apiGet, shouldUseMockData, allowsMockFallback, isNewsApiEnabled } = deps;

  function shouldUseNewsMockFallback(error: unknown): boolean {
    if (allowsMockFallback()) {
      return true;
    }

    return error instanceof AppError && error.status === 404;
  }

  async function fetchInvestmentNews(
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

  async function getInvestmentNews(
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

  return {
    fetchInvestmentNews,
    getInvestmentNews,
  };
}
