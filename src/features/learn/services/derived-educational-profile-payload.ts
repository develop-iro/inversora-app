import type { EducationalProfile } from '@/core/domain/educational-profile';

export type DerivedEducationalProfilePayload = Omit<EducationalProfile, 'answers'>;

/**
 * Maps a local educational profile to the derived payload accepted by the API.
 *
 * @param profile - Local educational profile including raw answers.
 */
export function toDerivedEducationalProfilePayload(
  profile: EducationalProfile,
): DerivedEducationalProfilePayload {
  return {
    knowledgeLevel: profile.knowledgeLevel,
    riskOrientation: profile.riskOrientation,
    investmentHorizon: profile.investmentHorizon,
    investorStyle: profile.investorStyle,
    financialReadiness: profile.financialReadiness,
    learningGoal: profile.learningGoal,
    profileVersion: profile.profileVersion,
    completedAt: profile.completedAt,
  };
}
