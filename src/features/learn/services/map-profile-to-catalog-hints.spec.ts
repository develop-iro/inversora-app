import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mapProfileToCatalogHints } from './map-profile-to-catalog-hints';

describe('mapProfileToCatalogHints', () => {
  it('suggests beginner filters for conservative profiles', () => {
    const hints = mapProfileToCatalogHints({
      knowledgeLevel: 'beginner',
      riskOrientation: 'conservative',
      investmentHorizon: 'long',
      learningGoal: 'learn-basics',
      answers: {},
      completedAt: '2026-07-01T00:00:00.000Z',
    });

    assert.equal(hints.filters.riskLevel, 'low');
    assert.equal(hints.filters.idealForBeginnersOnly, true);
  });
});
