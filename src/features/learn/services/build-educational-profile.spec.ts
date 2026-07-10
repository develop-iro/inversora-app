import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildEducationalProfile } from './build-educational-profile';

describe('buildEducationalProfile', () => {
  it('maps low-volatility answers to a conservative orientative profile', () => {
    const result = buildEducationalProfile({
      knowledge: 'intermediate',
      horizon: 'medium',
      goal: 'learn-basics',
      volatility: 'low',
      cushion: 'partial',
    });

    assert.equal(result.profile.riskOrientation, 'conservative');
    assert.equal(result.inconsistencies.length, 0);
  });

  it('flags short horizon with high volatility as inconsistent', () => {
    const result = buildEducationalProfile({
      knowledge: 'intermediate',
      horizon: 'short',
      goal: 'learn-compare',
      volatility: 'high',
      cushion: 'partial',
    });

    assert.ok(
      result.inconsistencies.some((item) => item.id === 'short-horizon-high-volatility'),
    );
    assert.notEqual(result.profile.riskOrientation, 'dynamic');
  });
});
