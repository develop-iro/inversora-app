import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { EDUCATIONAL_PROFILE_STORAGE_KEY } from '@/core/storage/educational-profile-storage-key';
import {
  createEducationalProfileStore,
  parseEducationalProfile,
} from '@/core/storage/educational-profile-store.factory';
import { createMemoryKeyValueStorage } from '@test/support/doubles/memory-key-value-storage';

function buildProfile(overrides: Partial<EducationalProfile> = {}): EducationalProfile {
  return {
    knowledgeLevel: 'beginner',
    riskOrientation: 'moderate',
    investmentHorizon: 'medium',
    investorStyle: 'balanced',
    financialReadiness: 'caution',
    learningGoal: 'learn-basics',
    profileVersion: 2,
    answers: { 'risk-tolerance': 'moderate' },
    completedAt: '2026-07-11T12:00:00.000Z',
    ...overrides,
  };
}

describe('parseEducationalProfile', () => {
  it('parses a valid profile and defaults missing v2 fields', () => {
    const parsed = parseEducationalProfile({
      knowledgeLevel: 'beginner',
      riskOrientation: 'conservative',
      investmentHorizon: 'long',
      learningGoal: 'learn-fees-risk',
      answers: { a: '1' },
      completedAt: '2026-01-01T00:00:00.000Z',
    });

    assert.ok(parsed);
    assert.equal(parsed.profileVersion, 1);
    assert.equal(parsed.investorStyle, 'balanced');
    assert.equal(parsed.financialReadiness, 'caution');
  });

  it('rejects invalid knowledge levels', () => {
    assert.equal(
      parseEducationalProfile({
        ...buildProfile(),
        knowledgeLevel: 'expert',
      }),
      null,
    );
  });
});

describe('educationalProfileStore contract', () => {
  it('saves, reads, and clears a profile through the storage port', async () => {
    const storage = createMemoryKeyValueStorage();
    const store = createEducationalProfileStore(storage);
    const profile = buildProfile();

    assert.equal(await store.getProfile(), null);
    await store.saveProfile(profile);
    assert.deepEqual(await store.getProfile(), profile);
    assert.ok(storage.dump()[EDUCATIONAL_PROFILE_STORAGE_KEY]);

    await store.clearProfile();
    assert.equal(await store.getProfile(), null);
  });

  it('serves the in-memory profile before re-reading storage', async () => {
    const storage = createMemoryKeyValueStorage();
    const store = createEducationalProfileStore(storage);
    const profile = buildProfile({ knowledgeLevel: 'advanced' });

    await store.saveProfile(profile);
    await storage.write(EDUCATIONAL_PROFILE_STORAGE_KEY, 'corrupt');
    assert.equal((await store.getProfile())?.knowledgeLevel, 'advanced');
  });
});
