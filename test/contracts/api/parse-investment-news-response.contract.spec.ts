import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseInvestmentNewsResponse } from '@/core/api/parse-investment-news-response';
import { AppError } from '@/core/errors/app-error';

function buildNewsItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 'news-1',
    title: 'Qué es el TER',
    summary: 'Explicación educativa de la comisión total.',
    source: 'Inversora',
    publishedAt: '2026-06-01T10:00:00.000Z',
    category: 'concepto',
    url: 'https://example.com/ter',
    ...overrides,
  };
}

describe('parseInvestmentNewsResponse', () => {
  it('parses a direct news array', () => {
    const items = parseInvestmentNewsResponse([
      buildNewsItem(),
      buildNewsItem({ id: 'news-2', category: 'mercado', url: undefined }),
    ]);

    assert.equal(items.length, 2);
    assert.equal(items[0]?.category, 'concepto');
    assert.equal(items[1]?.url, undefined);
  });

  it('parses a wrapped { data } envelope', () => {
    const items = parseInvestmentNewsResponse({
      data: [buildNewsItem({ category: 'regulacion' })],
    });

    assert.equal(items.length, 1);
    assert.equal(items[0]?.category, 'regulacion');
  });

  it('rejects payloads with any malformed item', () => {
    assert.throws(
      () => parseInvestmentNewsResponse([buildNewsItem(), { id: 'bad' }]),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );

    assert.throws(
      () => parseInvestmentNewsResponse([buildNewsItem({ category: 'rumor' })]),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});
