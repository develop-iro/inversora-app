import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AppError } from '@/core/errors/app-error';
import { scoreFund } from '@/core/scoring/score-fund';

describe('scoreFund', () => {
  it('requires a non-empty ISIN', () => {
    assert.throws(
      () =>
        scoreFund({
          isin: '   ',
          name: 'Test',
          categoryLabel: 'Global',
          terPercent: 0.2,
          riskLevel: 'medium',
        }),
      (error: unknown) => error instanceof AppError && error.code === 'SCORING_INVALID_INPUT',
    );
  });

  it('uses referenceScore when provided', () => {
    const scored = scoreFund({
      isin: 'IE00TEST0001',
      name: 'Test',
      categoryLabel: 'Global',
      terPercent: 0.5,
      riskLevel: 'medium',
      referenceScore: 92,
    });

    assert.equal(scored.score, 92);
    assert.equal(scored.status, 'ok');
    assert.ok(scored.breakdown.length > 0);
  });

  it('derives score from TER and marks low scores as warning', () => {
    const scored = scoreFund({
      isin: 'IE00TEST0001',
      name: 'Expensive',
      categoryLabel: 'Global',
      terPercent: 1.5,
      riskLevel: 'high',
    });

    // 100 - 1.5 * 40 = 40
    assert.equal(scored.score, 40);
    assert.equal(scored.status, 'warning');
  });
});
