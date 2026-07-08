import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateCompoundInterest,
  DEFAULT_COMPOUND_INTEREST_INPUT,
} from './compound-interest.engine';

describe('calculateCompoundInterest', () => {
  it('returns zero interest when rate is zero', () => {
    const result = calculateCompoundInterest({
      ...DEFAULT_COMPOUND_INTEREST_INPUT,
      initialBalance: 1000,
      periodicDeposit: 100,
      annualRatePercent: 0,
      durationYears: 5,
    });

    assert.equal(result.finalBalance, 1000 + 100 * 12 * 5);
    assert.equal(result.breakdown.interestComponent, 0);
  });

  it('computes positive growth for a moderate educational rate', () => {
    const result = calculateCompoundInterest({
      ...DEFAULT_COMPOUND_INTEREST_INPUT,
      initialBalance: 1000,
      periodicDeposit: 100,
      annualRatePercent: 5,
      durationYears: 10,
    });

    assert.ok(result.finalBalance > 1000 + 100 * 12 * 10);
    assert.ok(result.breakdown.interestComponent > 0);
    assert.equal(result.rows.length, 10);
  });

  it('caps duration at 40 years', () => {
    const result = calculateCompoundInterest({
      ...DEFAULT_COMPOUND_INTEREST_INPUT,
      durationYears: 99,
    });

    assert.equal(result.rows.length, 40);
  });
});
