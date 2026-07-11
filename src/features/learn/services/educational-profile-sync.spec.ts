import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { toDerivedEducationalProfilePayload } from '@/features/learn/services/derived-educational-profile-payload';

describe('toDerivedEducationalProfilePayload', () => {
  it('excludes raw questionnaire answers from the sync payload', () => {
    const profile: EducationalProfile = {
      knowledgeLevel: 'beginner',
      riskOrientation: 'moderate',
      investmentHorizon: 'medium',
      investorStyle: 'balanced',
      financialReadiness: 'caution',
      learningGoal: 'learn-basics',
      profileVersion: 2,
      completedAt: '2026-07-11T12:00:00.000Z',
      answers: {
        'risk-tolerance': 'moderate',
      },
    };

    const payload = toDerivedEducationalProfilePayload(profile);

    assert.deepEqual(payload, {
      knowledgeLevel: 'beginner',
      riskOrientation: 'moderate',
      investmentHorizon: 'medium',
      investorStyle: 'balanced',
      financialReadiness: 'caution',
      learningGoal: 'learn-basics',
      profileVersion: 2,
      completedAt: '2026-07-11T12:00:00.000Z',
    });
    assert.equal('answers' in payload, false);
  });
});
