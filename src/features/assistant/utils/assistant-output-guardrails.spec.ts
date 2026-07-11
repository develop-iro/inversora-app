import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ASSISTANT_GUARDRAIL_FALLBACK_TEXT,
  containsProhibitedRecommendationLanguage,
  sanitizeAssistantOutput,
} from './assistant-output-guardrails';

describe('assistant-output-guardrails', () => {
  it('detects prohibited recommendation language', () => {
    assert.equal(containsProhibitedRecommendationLanguage('Te recomiendo comprar este fondo.'), true);
    assert.equal(containsProhibitedRecommendationLanguage('El TER mide el coste anual del fondo.'), false);
  });

  it('returns fallback text when output violates guardrails', () => {
    assert.equal(
      sanitizeAssistantOutput('Deberías invertir ahora en este ETF.'),
      ASSISTANT_GUARDRAIL_FALLBACK_TEXT,
    );
  });

  it('keeps safe educational output unchanged', () => {
    const safe = 'El tracking error mide cuánto se desvía el fondo de su benchmark.';

    assert.equal(sanitizeAssistantOutput(safe), safe);
  });
});
