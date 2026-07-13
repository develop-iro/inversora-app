import { AppError } from '@/core/errors/app-error';
import { sanitizeAssistantOutput } from '@/features/assistant/utils/assistant-output-guardrails';
import type {
  AssistantChatResponse,
  AssistantExplainResponse,
} from '@/features/assistant/types/assistant-context';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAssistantSource(value: unknown): value is AssistantExplainResponse['source'] {
  return (
    value === 'glossary' ||
    value === 'cache' ||
    value === 'openai' ||
    value === 'openai-fallback' ||
    value === 'template' ||
    value === 'qwen'
  );
}

function parseAssistantResponseBase(
  payload: Record<string, unknown>,
): AssistantExplainResponse {
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
    text: sanitizeAssistantOutput(text),
    title,
    source,
    cached,
    disclaimer,
    relatedFundIsin,
    promptVersion,
  };
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

  return parseAssistantResponseBase(payload);
}

/**
 * Parses and validates an assistant chat API response.
 *
 * @param payload - Raw JSON payload from the API.
 */
export function parseAssistantChatResponse(payload: unknown): AssistantChatResponse {
  if (!isRecord(payload)) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta del asistente SORA no es válida.',
    );
  }

  const base = parseAssistantResponseBase(payload);
  const { sessionId } = payload;

  if (sessionId !== undefined && typeof sessionId !== 'string') {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta del asistente SORA no es válida.',
    );
  }

  return {
    ...base,
    sessionId,
  };
}
