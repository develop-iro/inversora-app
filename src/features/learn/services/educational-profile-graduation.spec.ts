import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { EducationalProfile } from '@/core/domain/educational-profile';
import { LEARN_CURRICULUM_LESSON_LIST } from '@/features/learn/constants/learn-curriculum';

import {
  applyQuestionnaireGraduation,
  createGraduatedProfileFromCurriculumCompletion,
  graduateBeginnerProfileToIntermediate,
  isCurriculumFullyCompleted,
  resolveCurriculumGraduatedProfile,
  shouldPersistGraduatedProfile,
} from './educational-profile-graduation';

const beginnerProfile: EducationalProfile = {
  knowledgeLevel: 'beginner',
  riskOrientation: 'moderate',
  investmentHorizon: 'medium',
  investorStyle: 'balanced',
  financialReadiness: 'caution',
  learningGoal: 'learn-basics',
  profileVersion: 2,
  answers: {
    knowledge: 'beginner',
    horizon: 'medium',
  },
  completedAt: '2026-07-01T00:00:00.000Z',
};

const intermediateProfile: EducationalProfile = {
  ...beginnerProfile,
  knowledgeLevel: 'intermediate',
  answers: {
    ...beginnerProfile.answers,
    knowledge: 'intermediate',
  },
};

const allLessonIds = LEARN_CURRICULUM_LESSON_LIST.map((lesson) => lesson.id);

describe('educational-profile-graduation', () => {
  it('detects full curriculum completion', () => {
    assert.equal(isCurriculumFullyCompleted([]), false);
    assert.equal(isCurriculumFullyCompleted(allLessonIds.slice(0, 7)), false);
    assert.equal(isCurriculumFullyCompleted(allLessonIds), true);
  });

  it('upgrades beginner profiles to intermediate', () => {
    const graduated = graduateBeginnerProfileToIntermediate(beginnerProfile);

    assert.equal(graduated.knowledgeLevel, 'intermediate');
    assert.equal(graduated.answers.knowledge, 'intermediate');
    assert.equal(graduated.riskOrientation, beginnerProfile.riskOrientation);
  });

  it('keeps intermediate and advanced profiles unchanged', () => {
    assert.equal(
      graduateBeginnerProfileToIntermediate(intermediateProfile),
      intermediateProfile,
    );
    assert.equal(
      graduateBeginnerProfileToIntermediate({
        ...intermediateProfile,
        knowledgeLevel: 'advanced',
      }).knowledgeLevel,
      'advanced',
    );
  });

  it('graduates questionnaire saves from beginner to intermediate', () => {
    const graduated = applyQuestionnaireGraduation(beginnerProfile);

    assert.equal(graduated.knowledgeLevel, 'intermediate');
    assert.equal(graduated.answers.knowledge, 'intermediate');
  });

  it('creates an intermediate profile when curriculum completes without a profile', () => {
    const graduated = createGraduatedProfileFromCurriculumCompletion();

    assert.equal(graduated.knowledgeLevel, 'intermediate');
    assert.equal(graduated.answers.knowledge, 'intermediate');
    assert.equal(graduated.profileVersion, 2);
  });

  it('resolves curriculum graduation for beginner profiles and missing profiles', () => {
    const progress = {
      completedLessonIds: allLessonIds,
      updatedAt: '2026-07-12T00:00:00.000Z',
    };

    assert.equal(
      resolveCurriculumGraduatedProfile(beginnerProfile, progress)?.knowledgeLevel,
      'intermediate',
    );
    assert.equal(
      resolveCurriculumGraduatedProfile(null, progress)?.knowledgeLevel,
      'intermediate',
    );
    assert.equal(resolveCurriculumGraduatedProfile(intermediateProfile, progress), null);
    assert.equal(resolveCurriculumGraduatedProfile(beginnerProfile, null), null);
  });

  it('detects when a graduated profile should be persisted', () => {
    const graduated = graduateBeginnerProfileToIntermediate(beginnerProfile);

    assert.equal(shouldPersistGraduatedProfile(null, graduated), true);
    assert.equal(shouldPersistGraduatedProfile(beginnerProfile, graduated), true);
    assert.equal(shouldPersistGraduatedProfile(intermediateProfile, intermediateProfile), false);
  });
});
