import type { EducationalProfile } from '@/core/domain/educational-profile';
import { LEARN_CURRICULUM_LESSON_LIST } from '@/features/learn/constants/learn-curriculum';
import type { CurriculumProgress } from '@/features/learn/entities/learn-curriculum.schema';

const CURRICULUM_LESSON_IDS = LEARN_CURRICULUM_LESSON_LIST.map((lesson) => lesson.id);

/**
 * Returns true when every curriculum lesson has been marked complete locally.
 *
 * @param completedLessonIds - Lesson ids stored in local curriculum progress.
 */
export function isCurriculumFullyCompleted(
  completedLessonIds: readonly string[],
): boolean {
  return CURRICULUM_LESSON_IDS.every((lessonId) => completedLessonIds.includes(lessonId));
}

/**
 * Upgrades a beginner orientative profile to intermediate for post-education surfaces.
 *
 * @param profile - Stored educational profile.
 */
export function graduateBeginnerProfileToIntermediate(
  profile: EducationalProfile,
): EducationalProfile {
  if (profile.knowledgeLevel !== 'beginner') {
    return profile;
  }

  return {
    ...profile,
    knowledgeLevel: 'intermediate',
    answers: {
      ...profile.answers,
      knowledge: 'intermediate',
    },
  };
}

/**
 * Applies graduation after the orientative questionnaire is saved.
 * Completing profile configuration unlocks intermediate surfaces even when the user
 * self-reported beginner knowledge.
 *
 * @param profile - Profile built from questionnaire answers.
 */
export function applyQuestionnaireGraduation(
  profile: EducationalProfile,
): EducationalProfile {
  return graduateBeginnerProfileToIntermediate(profile);
}

/**
 * Builds a minimal intermediate profile when the user graduates via curriculum only.
 */
export function createGraduatedProfileFromCurriculumCompletion(): EducationalProfile {
  return {
    knowledgeLevel: 'intermediate',
    riskOrientation: 'moderate',
    investmentHorizon: 'medium',
    investorStyle: 'balanced',
    financialReadiness: 'caution',
    learningGoal: 'learn-basics',
    profileVersion: 2,
    answers: {
      knowledge: 'intermediate',
    },
    completedAt: new Date().toISOString(),
  };
}

/**
 * Resolves whether local curriculum completion should persist an intermediate profile.
 *
 * @param profile - Current educational profile, if any.
 * @param progress - Local curriculum progress, if any.
 */
export function resolveCurriculumGraduatedProfile(
  profile: EducationalProfile | null,
  progress: CurriculumProgress | null,
): EducationalProfile | null {
  if (progress === null || !isCurriculumFullyCompleted(progress.completedLessonIds)) {
    return null;
  }

  if (profile !== null) {
    const graduated = graduateBeginnerProfileToIntermediate(profile);

    return graduated.knowledgeLevel === profile.knowledgeLevel ? null : graduated;
  }

  return createGraduatedProfileFromCurriculumCompletion();
}

/**
 * Returns true when the profile should be persisted after curriculum graduation.
 *
 * @param current - Profile before graduation.
 * @param graduated - Profile after graduation.
 */
export function shouldPersistGraduatedProfile(
  current: EducationalProfile | null,
  graduated: EducationalProfile,
): boolean {
  if (current === null) {
    return true;
  }

  return current.knowledgeLevel !== graduated.knowledgeLevel;
}
