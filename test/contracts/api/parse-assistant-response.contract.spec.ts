import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  parseAssistantChatResponse,
  parseAssistantExplainResponse,
} from '@/core/api/parse-assistant-response';
import { AppError } from '@/core/errors/app-error';
import { ASSISTANT_GUARDRAIL_FALLBACK_TEXT } from '@/features/assistant/utils/assistant-output-guardrails';

function buildAssistantPayload(overrides: Record<string, unknown> = {}) {
  return {
    text: 'El TER mide el coste anual del fondo en lenguaje sencillo.',
    source: 'glossary',
    cached: false,
    disclaimer: 'Información educativa. No es asesoramiento personalizado.',
    promptVersion: 'v1',
    title: 'Qué es el TER',
    ...overrides,
  };
}

describe('parseAssistantExplainResponse', () => {
  it('parses a valid explain payload', () => {
    const response = parseAssistantExplainResponse(buildAssistantPayload());

    assert.equal(response.source, 'glossary');
    assert.equal(response.cached, false);
    assert.match(response.text, /TER/);
  });

  it('sanitizes prohibited recommendation language', () => {
    const response = parseAssistantExplainResponse(
      buildAssistantPayload({
        text: 'Te recomiendo comprar este fondo ahora.',
      }),
    );

    assert.equal(response.text, ASSISTANT_GUARDRAIL_FALLBACK_TEXT);
  });

  it('throws on invalid envelopes or sources', () => {
    assert.throws(
      () => parseAssistantExplainResponse(null),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
    assert.throws(
      () => parseAssistantExplainResponse(buildAssistantPayload({ source: 'unknown-model' })),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
    assert.throws(
      () => parseAssistantExplainResponse(buildAssistantPayload({ text: '   ' })),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});

describe('parseAssistantChatResponse', () => {
  it('accepts an optional session id', () => {
    const response = parseAssistantChatResponse(
      buildAssistantPayload({ sessionId: 'session-123' }),
    );

    assert.equal(response.sessionId, 'session-123');
  });

  it('rejects non-string session ids', () => {
    assert.throws(
      () => parseAssistantChatResponse(buildAssistantPayload({ sessionId: 12 })),
      (error: unknown) => error instanceof AppError && error.code === 'API_INVALID_RESPONSE',
    );
  });
});
