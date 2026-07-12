import type { Href } from 'expo-router';

import type { InvestmentNewsItem } from '@/core/domain/investment-news';
import { isSafeHttpsUrl } from '@/core/security/safe-external-url';
import { routes } from '@/shared/navigation/routes';

export type InvestmentNewsPressAction =
  | { readonly kind: 'external'; readonly url: string }
  | { readonly kind: 'internal'; readonly href: Href };

const CURATED_NEWS_FALLBACKS: Readonly<Record<string, InvestmentNewsPressAction>> = {
  'news-ter-basics': { kind: 'internal', href: routes.learn },
  'news-tracking-error': { kind: 'internal', href: routes.learn },
  'news-ecb-context': {
    kind: 'external',
    url: 'https://www.ecb.europa.eu/press/pubby/date/2026/html/index.en.html',
  },
  'news-mifid-reminder': { kind: 'internal', href: routes.legal },
};

/**
 * Resolves how a home news card should navigate when pressed.
 *
 * @param item - News item from the API or local fallback.
 */
export function resolveInvestmentNewsPressAction(
  item: InvestmentNewsItem,
): InvestmentNewsPressAction | null {
  if (item.url && isSafeHttpsUrl(item.url)) {
    return { kind: 'external', url: item.url };
  }

  return CURATED_NEWS_FALLBACKS[item.id] ?? null;
}

/**
 * Returns whether a news item has a press action (external or in-app).
 *
 * @param item - News item from the API or local fallback.
 */
export function canOpenInvestmentNewsItem(item: InvestmentNewsItem): boolean {
  return resolveInvestmentNewsPressAction(item) !== null;
}
