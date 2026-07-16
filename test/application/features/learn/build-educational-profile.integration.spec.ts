import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildEducationalProfile } from '@/features/learn/services/build-educational-profile';

const BASE_ANSWERS = {
  knowledge: 'intermediate',
  horizon: 'medium',
  goal: 'learn-basics',
  volatility: 'medium',
  cushion: 'partial',
  debt: 'no-debt',
  'investor-style': 'balanced',
} as const;

describe('buildEducationalProfile', () => {
  it('maps low-volatility answers to a conservative orientative profile', () => {
    const result = buildEducationalProfile({
      ...BASE_ANSWERS,
      volatility: 'low',
    });

    assert.equal(result.profile.riskOrientation, 'conservative');
    assert.equal(result.profile.profileVersion, 2);
    assert.equal(result.profile.investorStyle, 'balanced');
    assert.equal(result.inconsistencies.length, 0);
  });

  it('caps high-debt answers to a conservative orientative profile', () => {
    const result = buildEducationalProfile({
      ...BASE_ANSWERS,
      debt: 'high-debt',
      volatility: 'high',
      horizon: 'long',
      cushion: 'solid',
    });

    assert.equal(result.profile.riskOrientation, 'conservative');
    assert.equal(result.profile.financialReadiness, 'not-ready');
  });

  it('preserves investor style as a parallel dimension', () => {
    const result = buildEducationalProfile({
      ...BASE_ANSWERS,
      'investor-style': 'enterprising',
    });

    assert.equal(result.profile.investorStyle, 'enterprising');
    assert.equal(result.profile.riskOrientation, 'moderate');
  });

  it('flags short horizon with high volatility as inconsistent', () => {
    const result = buildEducationalProfile({
      ...BASE_ANSWERS,
      horizon: 'short',
      volatility: 'high',
    });

    assert.ok(
      result.inconsistencies.some((item) => item.id === 'short-horizon-high-volatility'),
    );
    assert.notEqual(result.profile.riskOrientation, 'dynamic');
  });

  it('flags high debt with high volatility as inconsistent', () => {
    const result = buildEducationalProfile({
      ...BASE_ANSWERS,
      debt: 'high-debt',
      volatility: 'high',
    });

    assert.ok(
      result.inconsistencies.some((item) => item.id === 'high-debt-high-volatility'),
    );
    assert.equal(result.profile.riskOrientation, 'conservative');
  });

  it('marks financial readiness as caution for partial cushion', () => {
    const result = buildEducationalProfile({
      ...BASE_ANSWERS,
      cushion: 'partial',
      debt: 'no-debt',
    });

    assert.equal(result.profile.financialReadiness, 'caution');
  });
});
