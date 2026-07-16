import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseFundLiveMarketSnapshot } from '@/core/api/parse-fund-live-market-snapshot';
import { AppError } from '@/core/errors/app-error';

function buildLiveSnapshot(overrides: Record<string, unknown> = {}) {
  return {
    isin: 'IE00B4L5Y983',
    symbol: 'IWDA',
    price: 98.42,
    changePercent: 0.35,
    asOf: '2026-07-16T15:00:00.000Z',
    freshness: 'live',
    sourceLabel: 'Cotización ilustrativa de test',
    ...overrides,
  };
}

describe('parseFundLiveMarketSnapshot', () => {
  it('parses a live market snapshot', () => {
    const snapshot = parseFundLiveMarketSnapshot(buildLiveSnapshot());

    assert.equal(snapshot.isin, 'IE00B4L5Y983');
    assert.equal(snapshot.price, 98.42);
    assert.equal(snapshot.freshness, 'live');
  });

  it('allows null price and change with eod freshness', () => {
    const snapshot = parseFundLiveMarketSnapshot(
      buildLiveSnapshot({
        price: null,
        changePercent: null,
        freshness: 'eod',
      }),
    );

    assert.equal(snapshot.price, null);
    assert.equal(snapshot.changePercent, null);
    assert.equal(snapshot.freshness, 'eod');
  });

  it('throws on invalid freshness or envelope', () => {
    assert.throws(
      () => parseFundLiveMarketSnapshot(null),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
    assert.throws(
      () => parseFundLiveMarketSnapshot(buildLiveSnapshot({ freshness: 'delayed' })),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});
