import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateCompoundInterest,
  DEFAULT_COMPOUND_INTEREST_INPUT,
  FIXED_DEPOSIT_TIMING,
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

  it('uses start-of-period deposits by default for educational scenarios', () => {
    assert.equal(DEFAULT_COMPOUND_INTEREST_INPUT.depositTiming, FIXED_DEPOSIT_TIMING);
  });

  it('differs modestly from end-of-period timing for typical monthly scenarios', () => {
    const baseInput = {
      ...DEFAULT_COMPOUND_INTEREST_INPUT,
      initialBalance: 1000,
      periodicDeposit: 100,
      annualRatePercent: 5,
      durationYears: 10,
    };

    const startResult = calculateCompoundInterest({
      ...baseInput,
      depositTiming: 'start',
    });
    const endResult = calculateCompoundInterest({
      ...baseInput,
      depositTiming: 'end',
    });

    const relativeDifference =
      (startResult.finalBalance - endResult.finalBalance) / endResult.finalBalance;

    assert.ok(relativeDifference > 0);
    assert.ok(relativeDifference < 0.01);
  });
});
