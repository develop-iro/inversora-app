/** Orientative investment knowledge tier (not MiFID suitability). */
export type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';

/** Orientative risk tolerance label for educational filtering. */
export type RiskOrientation = 'conservative' | 'moderate' | 'dynamic';

/** Typical time horizon the user could keep capital invested. */
export type InvestmentHorizon = 'short' | 'medium' | 'long';

/** Graham-style investor effort and management preference. */
export type InvestorStyle = 'defensive' | 'balanced' | 'enterprising';

/** Orientative financial prerequisite readiness before investing. */
export type FinancialReadiness = 'ready' | 'caution' | 'not-ready';

/** Primary learning goal selected during profiling. */
export type LearningGoal = 'learn-basics' | 'learn-compare' | 'learn-fees-risk';

/** Schema version for locally stored educational profiles. */
export type EducationalProfileVersion = 1 | 2;

/** Anonymous educational profile stored locally on device. */
export type EducationalProfile = {
  readonly knowledgeLevel: KnowledgeLevel;
  readonly riskOrientation: RiskOrientation;
  readonly investmentHorizon: InvestmentHorizon;
  readonly investorStyle: InvestorStyle;
  readonly financialReadiness: FinancialReadiness;
  readonly learningGoal: LearningGoal;
  readonly profileVersion: EducationalProfileVersion;
  readonly answers: Readonly<Record<string, string>>;
  readonly completedAt: string;
};
