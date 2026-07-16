import type { Page } from '@playwright/test';

import {
  MOCK_CATALOG_FUNDS,
  MOCK_RANKING_GROUPS,
  SUGGESTED_COMPARISON_ISINS,
  toApiFund,
  type MockApiFund,
} from '../fixtures/catalog-funds';
import { toFundDetailPayload } from '../fixtures/fund-detail';

/**
 * Intercepts catalog HTTP calls with in-memory fixtures (Playwright route double).
 */
export async function mockFundsApi(page: Page, funds: MockApiFund[] = MOCK_CATALOG_FUNDS) {
  await page.route('**/funds**', async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.port !== '3000') {
      await route.continue();
      return;
    }

    if (
      requestUrl.pathname !== '/funds' &&
      requestUrl.pathname !== '/funds/catalog-metrics'
    ) {
      await route.continue();
      return;
    }

    const query = requestUrl.searchParams.get('q')?.trim().toLowerCase();
    const investmentTheme = requestUrl.searchParams.get('investmentTheme');
    const benchmark = requestUrl.searchParams.get('benchmark')?.trim().toLowerCase();
    const maxTer = Number(requestUrl.searchParams.get('maxTer') ?? Number.POSITIVE_INFINITY);
    const minScore = Number(requestUrl.searchParams.get('minScore') ?? 0);
    const minReturn1y = Number(requestUrl.searchParams.get('minReturn1y') ?? Number.NEGATIVE_INFINITY);
    const minReturn3y = Number(requestUrl.searchParams.get('minReturn3y') ?? Number.NEGATIVE_INFINITY);
    const idealForBeginnersOnly = requestUrl.searchParams.get('idealForBeginnersOnly') === 'true';
    const riskProfile = requestUrl.searchParams.get('riskProfile') ?? 'all';
    const pageNumber = Number(requestUrl.searchParams.get('page') ?? 1);
    const limit = Number(requestUrl.searchParams.get('limit') ?? 20);

    const filtered = funds.filter((fund) => {
      if (
        query &&
        !`${fund.symbol} ${fund.isin} ${fund.name} ${fund.benchmark}`.toLowerCase().includes(query)
      ) {
        return false;
      }

      if (investmentTheme && fund.investmentTheme !== investmentTheme) {
        return false;
      }

      if (benchmark && !fund.benchmark.toLowerCase().includes(benchmark)) {
        return false;
      }

      if (riskProfile === 'low' && fund.riskLevel > 2) {
        return false;
      }

      if (riskProfile === 'medium' && (fund.riskLevel < 3 || fund.riskLevel > 5)) {
        return false;
      }

      if (riskProfile === 'high' && fund.riskLevel < 6) {
        return false;
      }

      return (
        fund.ter <= maxTer &&
        fund.score >= minScore &&
        fund.oneYearReturn >= minReturn1y &&
        fund.threeYearReturn >= minReturn3y &&
        (!idealForBeginnersOnly || fund.idealForBeginners)
      );
    });

    if (requestUrl.pathname === '/funds/catalog-metrics') {
      const groups = new Map<string, MockApiFund[]>();

      for (const fund of filtered) {
        groups.set(fund.investmentTheme, [
          ...(groups.get(fund.investmentTheme) ?? []),
          fund,
        ]);
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*',
        },
        body: JSON.stringify({
          total: filtered.length,
          categories: [...groups.entries()].map(([id, categoryFunds]) => ({
            id,
            label: categoryFunds[0]?.benchmark ?? id,
            fundCount: categoryFunds.length,
            topScore: Math.max(...categoryFunds.map((entry) => entry.score)),
          })),
        }),
      });
      return;
    }

    const start = (pageNumber - 1) * limit;
    const data = filtered.slice(start, start + limit).map(toApiFund);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({
        data,
        meta: {
          page: pageNumber,
          limit,
          total: filtered.length,
          totalPages: filtered.length === 0 ? 0 : Math.ceil(filtered.length / limit),
        },
      }),
    });
  });
}

/**
 * Intercepts rankings HTTP calls with fixture groups.
 */
export async function mockRankingsApi(page: Page) {
  const groups = MOCK_RANKING_GROUPS;

  await page.route('**/rankings**', async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.port === '8099') {
      await route.continue();
      return;
    }

    const benchmark = requestUrl.searchParams.get('benchmark');
    const data = benchmark ? groups.filter((group) => group.benchmarkKey === benchmark) : groups;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({
        data,
        meta: {
          totalGroups: groups.length,
          returnedGroups: data.length,
          groupsLimit: groups.length,
          limit: 10,
          hasMoreGroups: false,
          totalEligibleFunds: 3,
        },
      }),
    });
  });
}

/**
 * Forces suggested-comparison fund detail endpoints to miss (404).
 */
export async function mockSuggestedComparisonDetailMisses(page: Page) {
  for (const isin of SUGGESTED_COMPARISON_ISINS) {
    await page.route(`**/funds/${isin}`, async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*',
        },
        body: JSON.stringify({
          statusCode: 404,
          message: 'Not found',
        }),
      });
    });
  }
}

/**
 * Intercepts `GET /funds/:isin` detail calls with Playwright fixtures.
 *
 * @param page - Playwright page.
 * @param funds - Catalog funds available as detail payloads.
 */
export async function mockFundDetailApi(
  page: Page,
  funds: MockApiFund[] = MOCK_CATALOG_FUNDS,
) {
  await page.route('**/funds/*', async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.port === '8099') {
      await route.continue();
      return;
    }

    const match = requestUrl.pathname.match(/^\/funds\/([^/]+)$/);
    const pathSegment = match?.[1];

    if (match === null || pathSegment === undefined || pathSegment === 'catalog-metrics') {
      await route.continue();
      return;
    }

    const isin = decodeURIComponent(pathSegment).toUpperCase();
    const fund = funds.find((entry) => entry.isin.toUpperCase() === isin);

    if (fund === undefined) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*',
        },
        body: JSON.stringify({
          statusCode: 404,
          message: 'Not found',
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(toFundDetailPayload(fund)),
    });
  });
}
