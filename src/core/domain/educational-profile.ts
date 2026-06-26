/** Orientative investment knowledge tier (not MiFID suitability). */
export type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';

/** Orientative risk tolerance label for educational filtering. */
export type RiskOrientation = 'conservative' | 'moderate' | 'dynamic';

/** Typical time horizon the user could keep capital invested. */
export type InvestmentHorizon = 'short' | 'medium' | 'long';

/** Primary learning goal selected during profiling. */
export type LearningGoal = 'learn-basics' | 'learn-compare' | 'learn-fees-risk';

/** Anonymous educational profile stored locally on device. */
export type EducationalProfile = {
  readonly knowledgeLevel: KnowledgeLevel;
  readonly riskOrientation: RiskOrientation;
  readonly investmentHorizon: InvestmentHorizon;
  readonly learningGoal: LearningGoal;
  readonly answers: Readonly<Record<string, string>>;
  readonly completedAt: string;
};
