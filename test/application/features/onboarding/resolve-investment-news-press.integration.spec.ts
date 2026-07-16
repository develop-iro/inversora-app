import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { InvestmentNewsItem } from '@/core/domain/investment-news';

import {
  canOpenInvestmentNewsItem,
  resolveInvestmentNewsPressAction,
} from '@/features/onboarding/services/resolve-investment-news-press';

const curatedItem: InvestmentNewsItem = {
  id: 'news-ter-basics',
  title: 'Qué es el TER',
  summary: 'Resumen educativo.',
  source: 'Inversora Educa',
  publishedAt: '2026-06-20',
  category: 'concepto',
};

describe('resolve-investment-news-press', () => {
  it('opens trusted https URLs from market news', () => {
    const action = resolveInvestmentNewsPressAction({
      ...curatedItem,
      id: 'fmp-abc123',
      url: 'https://www.marketwatch.com/story/example-headline',
    });

    assert.deepEqual(action, {
      kind: 'external',
      url: 'https://www.marketwatch.com/story/example-headline',
    });
  });

  it('falls back to in-app routes for curated headlines without URL', () => {
    assert.deepEqual(resolveInvestmentNewsPressAction(curatedItem), {
      kind: 'internal',
      href: '/questionnaire',
    });
    assert.deepEqual(
      resolveInvestmentNewsPressAction({ ...curatedItem, id: 'news-mifid-reminder' }),
      {
        kind: 'internal',
        href: '/legal',
      },
    );
  });

  it('reports whether a news item can be opened', () => {
    assert.equal(canOpenInvestmentNewsItem(curatedItem), true);
    assert.equal(
      canOpenInvestmentNewsItem({
        ...curatedItem,
        id: 'unknown-news-item',
      }),
      false,
    );
  });
});
