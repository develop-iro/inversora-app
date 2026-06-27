import { normalizeFundSearchQuery } from '@/features/funds/utils/fund-search';

const QUESTION_MARKERS = [
  'qué ',
  'que ',
  'cómo ',
  'como ',
  'cuál ',
  'cual ',
  'por qué',
  'porque ',
  'ayuda',
  'explica',
  'significa',
  'diferencia',
  'quiero ',
] as const;

/**
 * Returns true when the query looks like an educational question rather than a fund lookup.
 *
 * @param query - Raw search query.
 */
export function isQuestionLikeQuery(query: string): boolean {
  const normalized = normalizeFundSearchQuery(query);

  if (!normalized) {
    return false;
  }

  if (query.includes('?')) {
    return true;
  }

  return QUESTION_MARKERS.some((marker) => normalized.includes(marker));
}
