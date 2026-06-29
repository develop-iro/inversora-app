export const INVESTMENT_NEWS_CATEGORIES = ['concepto', 'mercado', 'regulacion'] as const;

export type InvestmentNewsCategory = (typeof INVESTMENT_NEWS_CATEGORIES)[number];

export type InvestmentNewsItem = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly source: string;
  readonly publishedAt: string;
  readonly category: InvestmentNewsCategory;
  readonly url?: string;
};

/**
 * Returns whether a value is a supported investment news category.
 *
 * @param value - Raw category string.
 */
export function isInvestmentNewsCategory(value: string): value is InvestmentNewsCategory {
  return (INVESTMENT_NEWS_CATEGORIES as readonly string[]).includes(value);
}
