import type { FundDetail } from '@/core/domain/catalog';

import type { CompareFairnessResult } from '@/features/comparison/models/compare-fund-entry';
import { evaluateCompareFairness } from '@/features/comparison/utils/evaluate-compare-fairness';

const BASE_PROMPTS = [
  '¿Qué diferencia hay en el TER?',
  '¿Esta comparación es homogénea?',
  '¿Cómo interpretar el Score Inversora aquí?',
] as const;

/**
 * Builds contextual quick prompts for the comparison SORA chat.
 *
 * @param details - Loaded fund details in comparison order.
 * @param fairness - Precomputed fairness evaluation.
 */
export function buildCompareQuickPrompts(
  details: readonly FundDetail[],
  fairness: CompareFairnessResult = evaluateCompareFairness(details),
): string[] {
  const prompts = [...BASE_PROMPTS];

  if (!fairness.isFair) {
    prompts.push('¿Qué limitaciones tiene esta comparación?');
  }

  if (details.length >= 2) {
    const terValues = details.map((detail) => detail.fund.terPercent);
    const terSpread = Math.max(...terValues) - Math.min(...terValues);

    if (terSpread >= 0.1) {
      prompts.push('¿Por qué importa esta diferencia de TER?');
    }

    const scores = details.map((detail) => detail.inversoraScore);
    const scoreSpread = Math.max(...scores) - Math.min(...scores);

    if (scoreSpread <= 3) {
      prompts.push('¿Qué criterios desempatan el score?');
    }
  }

  const hasDataWarning = details.some(
    (detail) => detail.scoringStatus === 'warning' || detail.scoringStatus === 'quarantined',
  );

  if (hasDataWarning) {
    prompts.push('¿Por qué algún fondo tiene datos limitados?');
  }

  return [...new Set(prompts)].slice(0, 5);
}
