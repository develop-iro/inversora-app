import type {
  EducationalProfile,
  FinancialReadiness,
  InvestmentHorizon,
  InvestorStyle,
  KnowledgeLevel,
  LearningGoal,
  RiskOrientation,
} from '@/core/domain/educational-profile';

export type ProfileInconsistency = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

export type BuildEducationalProfileResult = {
  readonly profile: EducationalProfile;
  readonly inconsistencies: readonly ProfileInconsistency[];
};

type ScoreWeights = {
  readonly volatility: number;
  readonly horizon: number;
  readonly cushion: number;
};

const VOLATILITY_WEIGHTS: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const HORIZON_WEIGHTS: Record<string, number> = {
  short: 0,
  medium: 1,
  long: 2,
};

const CUSHION_WEIGHTS: Record<string, number> = {
  none: 0,
  partial: 1,
  solid: 2,
};

function scoreToRiskOrientation(score: number): RiskOrientation {
  if (score <= 2) {
    return 'conservative';
  }

  if (score <= 4) {
    return 'moderate';
  }

  return 'dynamic';
}

function capRiskOrientation(
  orientation: RiskOrientation,
  cap: RiskOrientation,
): RiskOrientation {
  const order: RiskOrientation[] = ['conservative', 'moderate', 'dynamic'];
  const currentIndex = order.indexOf(orientation);
  const capIndex = order.indexOf(cap);

  return order[Math.min(currentIndex, capIndex)] ?? orientation;
}

function getScoreWeights(answers: Record<string, string>): ScoreWeights {
  return {
    volatility: VOLATILITY_WEIGHTS[answers.volatility] ?? 0,
    horizon: HORIZON_WEIGHTS[answers.horizon] ?? 0,
    cushion: CUSHION_WEIGHTS[answers.cushion] ?? 0,
  };
}

function resolveFinancialReadiness(answers: Record<string, string>): FinancialReadiness {
  const cushion = answers.cushion;
  const debt = answers.debt;

  if (cushion === 'none' || debt === 'high-debt') {
    return 'not-ready';
  }

  if (cushion === 'partial' || debt === 'manageable-debt') {
    return 'caution';
  }

  return 'ready';
}

function detectInconsistencies(answers: Record<string, string>): ProfileInconsistency[] {
  const inconsistencies: ProfileInconsistency[] = [];
  const knowledge = answers.knowledge;
  const horizon = answers.horizon;
  const volatility = answers.volatility;
  const cushion = answers.cushion;
  const debt = answers.debt;

  if (volatility === 'high' && cushion === 'none') {
    inconsistencies.push({
      id: 'high-volatility-no-cushion',
      title: 'Mucha tolerancia al riesgo, poca holgura',
      body:
        'Aceptas caídas con perspectiva, pero también indicas poco margen para imprevistos. Es una combinación habitual: te orientaremos con especial prudencia.',
    });
  }

  if (horizon === 'short' && volatility === 'high') {
    inconsistencies.push({
      id: 'short-horizon-high-volatility',
      title: 'Plazo corto con alta tolerancia',
      body:
        'Con menos de 4 años suele haber poco margen para recuperar bajadas fuertes. Tu perfil encaja mejor con un enfoque gradual y contenido prudente.',
    });
  }

  if (knowledge === 'beginner' && volatility === 'high') {
    inconsistencies.push({
      id: 'beginner-high-volatility',
      title: 'Estás aprendiendo y asumes mucha volatilidad',
      body:
        'Es normal empezar con cautela. Si aún estás formándote, adaptaremos las explicaciones a un ritmo más pausado.',
    });
  }

  if (horizon === 'short' && cushion === 'none') {
    inconsistencies.push({
      id: 'short-horizon-no-cushion',
      title: 'Poca holgura financiera',
      body:
        'Combinas plazo corto y poco colchón de ahorro. Es un perfil válido que suele ir de la mano con productos más estables; te guiaremos en esa línea.',
    });
  }

  if (debt === 'high-debt' && volatility === 'high') {
    inconsistencies.push({
      id: 'high-debt-high-volatility',
      title: 'Deuda alta y alta tolerancia',
      body:
        'Con deudas costosas conviene priorizar estabilidad. Tu perfil orientativo reflejará ese contexto antes de sugerir comparaciones.',
    });
  }

  return inconsistencies;
}

function hasCriticalInconsistency(inconsistencies: readonly ProfileInconsistency[]): boolean {
  return inconsistencies.some(
    (item) =>
      item.id === 'short-horizon-high-volatility' ||
      item.id === 'high-volatility-no-cushion' ||
      item.id === 'high-debt-high-volatility',
  );
}

/**
 * Builds an orientative educational profile from questionnaire answers.
 * Scoring is deterministic and capped for beginners, weak cushions, or high debt.
 */
export function buildEducationalProfile(
  answers: Record<string, string>,
): BuildEducationalProfileResult {
  const knowledgeLevel = answers.knowledge as KnowledgeLevel;
  const investmentHorizon = answers.horizon as InvestmentHorizon;
  const investorStyle = answers['investor-style'] as InvestorStyle;
  const learningGoal = answers.goal as LearningGoal;
  const financialReadiness = resolveFinancialReadiness(answers);
  const weights = getScoreWeights(answers);
  const rawScore = weights.volatility + weights.horizon + weights.cushion;
  let riskOrientation = scoreToRiskOrientation(rawScore);

  if (answers.debt === 'high-debt') {
    riskOrientation = capRiskOrientation(riskOrientation, 'conservative');
  }

  if (answers.cushion === 'none') {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  if (answers.horizon === 'short') {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  if (knowledgeLevel === 'beginner') {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  const inconsistencies = detectInconsistencies(answers);

  if (hasCriticalInconsistency(inconsistencies)) {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  const profile: EducationalProfile = {
    knowledgeLevel,
    riskOrientation,
    investmentHorizon,
    investorStyle,
    financialReadiness,
    learningGoal,
    profileVersion: 2,
    answers,
    completedAt: new Date().toISOString(),
  };

  return { profile, inconsistencies };
}

/**
 * Returns a human-readable label for a risk orientation tier.
 *
 * @param orientation - Orientative risk tier.
 */
export function getRiskOrientationLabel(orientation: RiskOrientation): string {
  switch (orientation) {
    case 'conservative':
      return 'Conservador';
    case 'dynamic':
      return 'Dinámico';
    case 'moderate':
    default:
      return 'Moderado';
  }
}

/**
 * Returns a human-readable label for a knowledge level.
 *
 * @param level - Knowledge tier.
 */
export function getKnowledgeLevelLabel(level: KnowledgeLevel): string {
  switch (level) {
    case 'advanced':
      return 'Con bases sólidas';
    case 'intermediate':
      return 'Con nociones';
    case 'beginner':
    default:
      return 'Principiante';
  }
}

/**
 * Returns a human-readable label for an investment horizon.
 *
 * @param horizon - Time horizon tier.
 */
export function getInvestmentHorizonLabel(horizon: InvestmentHorizon): string {
  switch (horizon) {
    case 'long':
      return 'Largo (más de 10 años)';
    case 'medium':
      return 'Medio (5–10 años)';
    case 'short':
    default:
      return 'Corto (menos de 4 años)';
  }
}

/**
 * Returns a human-readable label for an investor style.
 *
 * @param style - Graham-style investor effort preference.
 */
export function getInvestorStyleLabel(style: InvestorStyle): string {
  switch (style) {
    case 'defensive':
      return 'Defensivo (piloto automático)';
    case 'enterprising':
      return 'Emprendedor (activo)';
    case 'balanced':
    default:
      return 'Equilibrado';
  }
}

/**
 * Returns a human-readable label for financial readiness.
 *
 * @param readiness - Orientative financial prerequisite tier.
 */
export function getFinancialReadinessLabel(readiness: FinancialReadiness): string {
  switch (readiness) {
    case 'not-ready':
      return 'Convendría reforzar colchón o deuda';
    case 'caution':
      return 'Con cautela';
    case 'ready':
    default:
      return 'Con margen razonable';
  }
}

/**
 * Returns a human-readable label for a learning goal.
 *
 * @param goal - Selected learning goal.
 */
export function getLearningGoalLabel(goal: LearningGoal): string {
  switch (goal) {
    case 'learn-compare':
      return 'Comparar fondos con calma';
    case 'learn-fees-risk':
      return 'Entender comisiones y riesgo';
    case 'learn-basics':
    default:
      return 'Aprender conceptos básicos';
  }
}

/**
 * Returns an educational summary paragraph for the completed profile.
 *
 * @param profile - Completed educational profile.
 */
export function getEducationalProfileSummary(profile: EducationalProfile): string {
  const riskLabel = getRiskOrientationLabel(profile.riskOrientation).toLowerCase();
  const horizonLabel = getInvestmentHorizonLabel(profile.investmentHorizon).toLowerCase();
  const styleLabel = getInvestorStyleLabel(profile.investorStyle).toLowerCase();

  let summary = `Tu perfil orientativo es ${riskLabel}, con horizonte ${horizonLabel} y estilo ${styleLabel}.`;

  if (profile.financialReadiness === 'not-ready') {
    summary +=
      ' Antes de invertir, convendría reforzar tu colchón de emergencia o reducir deudas con intereses altos.';
  } else if (profile.financialReadiness === 'caution') {
    summary += ' Tu situación financiera sugiere avanzar con cautela.';
  }

  summary +=
    ' Usaremos esto para contextualizar explicaciones y filtros educativos, no para recomendarte productos concretos.';

  return summary;
}
