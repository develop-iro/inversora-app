/** Mirrors `inversora-api` assistant guardrails (HU-40) for client-side defense in depth. */
export const ASSISTANT_GUARDRAIL_FALLBACK_TEXT =
  'Inversora comparte información educativa. No puedo recomendar comprar, vender o suscribir un fondo concreto. Si quieres, te explico conceptos, métricas o el significado del score en lenguaje sencillo.';

const FORBIDDEN_OUTPUT_PATTERNS: readonly RegExp[] = [
  /\bcompra(r|me|lo|a)\b/i,
  /\bvende(r|me|lo|a)\b/i,
  /\bsuscr[ií]b(e|ete|ir)\b/i,
  /\bdeber[ií]as\s+invertir\b/i,
  /\bdeber[ií]as\b/i,
  /\binvierte\s+(ahora|ya)\b/i,
  /\bte recomiendo\b/i,
  /\bmejor opci[oó]n\b/i,
  /\bideal para ti\b/i,
  /\bapuesta por\b/i,
];

const MAX_RESPONSE_LENGTH = 2_000;

/**
 * Returns true when assistant text contains prohibited recommendation language.
 *
 * @param text - Assistant output text.
 */
export function containsProhibitedRecommendationLanguage(text: string): boolean {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return true;
  }

  return FORBIDDEN_OUTPUT_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/**
 * Sanitizes assistant output or returns the educational fallback (HU-40).
 *
 * @param text - Raw assistant output.
 */
export function sanitizeAssistantOutput(text: string): string {
  if (containsProhibitedRecommendationLanguage(text)) {
    return ASSISTANT_GUARDRAIL_FALLBACK_TEXT;
  }

  const trimmed = text.trim();

  if (trimmed.length <= MAX_RESPONSE_LENGTH) {
    return trimmed;
  }

  return `${trimmed.slice(0, MAX_RESPONSE_LENGTH - 1).trimEnd()}…`;
}
