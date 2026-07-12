import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import {
  resolveSecondaryTabConfig,
  resolveSecondaryTabMode,
} from '@/features/learn/services/secondary-tab-config';

const beginnerProfile: Pick<EducationalProfile, 'knowledgeLevel'> = {
  knowledgeLevel: 'beginner',
};

const intermediateProfile: Pick<EducationalProfile, 'knowledgeLevel'> = {
  knowledgeLevel: 'intermediate',
};

describe('resolveSecondaryTabMode', () => {
  it('shows learn tab for beginner or missing profile', () => {
    assert.equal(resolveSecondaryTabMode(null), 'learn');
    assert.equal(resolveSecondaryTabMode(undefined), 'learn');
    assert.equal(resolveSecondaryTabMode(beginnerProfile), 'learn');
  });

  it('shows favorites tab for intermediate and advanced profiles', () => {
    assert.equal(resolveSecondaryTabMode(intermediateProfile), 'favorites');
    assert.equal(
      resolveSecondaryTabMode({ knowledgeLevel: 'advanced' }),
      'favorites',
    );
  });
});

describe('resolveSecondaryTabConfig', () => {
  it('returns Aprendizaje labels for learn mode', () => {
    const config = resolveSecondaryTabConfig('learn');
    assert.equal(config.label, 'Aprendizaje');
    assert.equal(config.activeIcon, 'book-open-page-variant');
  });

  it('returns Favoritos labels for favorites mode', () => {
    const config = resolveSecondaryTabConfig('favorites');
    assert.equal(config.label, 'Favoritos');
    assert.equal(config.activeIcon, 'heart');
  });
});
