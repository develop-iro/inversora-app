import type {
  EducationalProfile,
  InvestmentHorizon,
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

function detectInconsistencies(answers: Record<string, string>): ProfileInconsistency[] {
  const inconsistencies: ProfileInconsistency[] = [];
  const knowledge = answers.knowledge;
  const horizon = answers.horizon;
  const volatility = answers.volatility;
  const cushion = answers.cushion;

  if (volatility === 'high' && cushion === 'none') {
    inconsistencies.push({
      id: 'high-volatility-no-cushion',
      title: 'Alta tolerancia sin colchón de ahorro',
      body:
        'Indicas que aceptarías caídas con perspectiva, pero también que no tienes margen para imprevistos. En la práctica, una caída podría obligarte a vender en mal momento.',
    });
  }

  if (horizon === 'short' && volatility === 'high') {
    inconsistencies.push({
      id: 'short-horizon-high-volatility',
      title: 'Horizonte corto y alta tolerancia a caídas',
      body:
        'Un horizonte inferior a 3 años suele dejar poco margen para recuperar bajadas fuertes, aunque mentalmente aceptes la volatilidad.',
    });
  }

  if (knowledge === 'beginner' && volatility === 'high') {
    inconsistencies.push({
      id: 'beginner-high-volatility',
      title: 'Principiante con alta tolerancia declarada',
      body:
        'Es habitual empezar con cautela. Si aún estás aprendiendo, conviene revisar si realmente te sentirías cómodo con fondos más volátiles.',
    });
  }

  if (horizon === 'short' && cushion === 'none') {
    inconsistencies.push({
      id: 'short-horizon-no-cushion',
      title: 'Poco margen en todos los frentes',
      body:
        'Combinar horizonte corto y sin colchón de ahorro suele encajar mejor con perfiles muy prudentes y productos de menor riesgo.',
    });
  }

  return inconsistencies;
}

/**
 * Builds an orientative educational profile from questionnaire answers.
 * Scoring is deterministic and capped for beginners or weak financial cushions.
 */
export function buildEducationalProfile(
  answers: Record<string, string>,
): BuildEducationalProfileResult {
  const knowledgeLevel = answers.knowledge as KnowledgeLevel;
  const investmentHorizon = answers.horizon as InvestmentHorizon;
  const learningGoal = answers.goal as LearningGoal;
  const weights = getScoreWeights(answers);
  const rawScore = weights.volatility + weights.horizon + weights.cushion;
  let riskOrientation = scoreToRiskOrientation(rawScore);

  if (knowledgeLevel === 'beginner') {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  if (answers.cushion === 'none') {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  if (answers.horizon === 'short') {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  const inconsistencies = detectInconsistencies(answers);

  if (
    inconsistencies.some(
      (item) =>
        item.id === 'short-horizon-high-volatility' ||
        item.id === 'high-volatility-no-cushion',
    )
  ) {
    riskOrientation = capRiskOrientation(riskOrientation, 'moderate');
  }

  const profile: EducationalProfile = {
    knowledgeLevel,
    riskOrientation,
    investmentHorizon,
    learningGoal,
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
      return 'Largo (más de 7 años)';
    case 'medium':
      return 'Medio (3–7 años)';
    case 'short':
    default:
      return 'Corto (menos de 3 años)';
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

  return `Tu perfil orientativo es ${riskLabel}, con horizonte ${horizonLabel}. Usaremos esto para contextualizar explicaciones y filtros educativos, no para recomendarte productos concretos.`;
}
