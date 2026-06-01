import { AppError } from '@/core/errors/app-error';
import type { FundScoringInput } from '@/core/domain/fund';
import { SCORING_CRITERIA } from '@/core/scoring/criteria';

import type {
  ScoreBreakdown,
  ScoreCriterionResult,
  ScoredFund,
  ScoringStatus,
} from './types';

const MAX_SCORE = 100;

function clampScore(value: number): number {
  return Math.max(0, Math.min(MAX_SCORE, Math.round(value)));
}

function buildMockBreakdown(score: number): ScoreBreakdown {
  const entries = Object.entries(SCORING_CRITERIA);
  const totalWeight = entries.reduce((sum, [, criterion]) => sum + criterion.weight, 0);
  let allocated = 0;

  return entries.map(([id, criterion], index) => {
    const maxPoints = Math.round(criterion.weight / totalWeight * MAX_SCORE);
    const isLast = index === entries.length - 1;
    const points = isLast ? score - allocated : Math.round((score / MAX_SCORE) * maxPoints);
    allocated += points;

    return {
      id: id as ScoreCriterionResult['id'],
      label: criterion.label,
      points: clampScore(points),
      maxPoints,
    };
  });
}

/**
 * Deterministic mock scorer for development.
 * Uses `referenceScore` when provided; otherwise derives a score from TER (lower is better).
 */
export function scoreFund(input: FundScoringInput): ScoredFund {
  if (!input.isin.trim()) {
    throw new AppError('SCORING_INVALID_INPUT', 'El ISIN es obligatorio para calcular el score.');
  }

  const derivedFromTer = clampScore(MAX_SCORE - input.terPercent * 40);
  const score = clampScore(input.referenceScore ?? derivedFromTer);
  const status: ScoringStatus = score >= 70 ? 'ok' : 'warning';

  return {
    isin: input.isin,
    name: input.name,
    categoryLabel: input.categoryLabel,
    score,
    riskLevel: input.riskLevel,
    terPercent: input.terPercent,
    status,
    breakdown: buildMockBreakdown(score),
  };
}
