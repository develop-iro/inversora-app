import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  EDUCATIONAL_RATE_SCENARIOS,
  matchEducationalScenario,
} from '@/features/calculator/constants/educational-scenarios';

describe('matchEducationalScenario', () => {
  it('matches the three educational presets by annual rate', () => {
    for (const scenario of EDUCATIONAL_RATE_SCENARIOS) {
      assert.equal(matchEducationalScenario(scenario.annualRatePercent), scenario.id);
    }
  });

  it('returns custom when the rate is not a preset', () => {
    assert.equal(matchEducationalScenario(4.5), 'custom');
    assert.equal(matchEducationalScenario(0), 'custom');
  });
});
