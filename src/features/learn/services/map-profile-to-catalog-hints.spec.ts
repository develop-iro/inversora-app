import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mapProfileToCatalogHints } from './map-profile-to-catalog-hints';

const BASE_PROFILE = {
  knowledgeLevel: 'intermediate' as const,
  investmentHorizon: 'long' as const,
  learningGoal: 'learn-basics' as const,
  investorStyle: 'balanced' as const,
  financialReadiness: 'ready' as const,
  profileVersion: 2 as const,
  answers: {},
  completedAt: '2026-07-01T00:00:00.000Z',
};

describe('mapProfileToCatalogHints', () => {
  it('suggests beginner filters for conservative profiles', () => {
    const hints = mapProfileToCatalogHints({
      ...BASE_PROFILE,
      knowledgeLevel: 'beginner',
      riskOrientation: 'conservative',
    });

    assert.equal(hints.filters.riskLevel, 'low');
    assert.equal(hints.filters.idealForBeginnersOnly, true);
  });

  it('boosts beginner filters for defensive investor style', () => {
    const hints = mapProfileToCatalogHints({
      ...BASE_PROFILE,
      riskOrientation: 'moderate',
      investorStyle: 'defensive',
    });

    assert.equal(hints.filters.riskLevel, 'medium');
    assert.equal(hints.filters.idealForBeginnersOnly, true);
  });

  it('boosts beginner filters when knowledge level is beginner', () => {
    const hints = mapProfileToCatalogHints({
      ...BASE_PROFILE,
      knowledgeLevel: 'beginner',
      riskOrientation: 'moderate',
    });

    assert.equal(hints.filters.riskLevel, 'medium');
    assert.equal(hints.filters.idealForBeginnersOnly, true);
  });

  it('adds an educational note for enterprising investor style', () => {
    const hints = mapProfileToCatalogHints({
      ...BASE_PROFILE,
      riskOrientation: 'dynamic',
      investorStyle: 'enterprising',
    });

    assert.match(hints.summary, /fondos indexados/i);
  });
});
