import { AppError } from '@/core/errors/app-error';
import type { AssistantExplainResponse } from '@/features/assistant/types/assistant-context';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAssistantSource(value: unknown): value is AssistantExplainResponse['source'] {
  return value === 'glossary' || value === 'cache' || value === 'openai';
}

/**
 * Parses and validates an assistant explain API response.
 *
 * @param payload - Raw JSON payload from the API.
 */
export function parseAssistantExplainResponse(
  payload: unknown,
): AssistantExplainResponse {
  if (!isRecord(payload)) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta del asistente SORA no es válida.',
    );
  }

  const { text, title, source, cached, disclaimer, relatedFundIsin, promptVersion } =
    payload;

  if (
    typeof text !== 'string' ||
    text.trim().length === 0 ||
    !isAssistantSource(source) ||
    typeof cached !== 'boolean' ||
    typeof disclaimer !== 'string' ||
    typeof promptVersion !== 'string' ||
    (title !== undefined && typeof title !== 'string') ||
    (relatedFundIsin !== undefined && typeof relatedFundIsin !== 'string')
  ) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta del asistente SORA no es válida.',
    );
  }

  return {
    text,
    title,
    source,
    cached,
    disclaimer,
    relatedFundIsin,
    promptVersion,
  };
}
