import { apiPost } from '@/core/api/client';
import {
  parseAssistantChatResponse,
  parseAssistantExplainResponse,
} from '@/core/api/parse-assistant-response';
import type {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantExplainRequest,
  AssistantExplainResponse,
} from '@/features/assistant/types/assistant-context';

/**
 * Requests an educational explanation from the SORA assistant API.
 *
 * @param request - Assistant context and user message.
 */
export async function explainAssistant(
  request: AssistantExplainRequest,
): Promise<AssistantExplainResponse> {
  const payload = await apiPost<unknown, AssistantExplainRequest>({
    path: '/assistant/explain',
    body: request,
  });

  return parseAssistantExplainResponse(payload);
}

/**
 * Requests a conversational assistant reply from the SORA chat API.
 *
 * @param request - Chat context, optional session and selected funds.
 */
export async function chatAssistant(
  request: AssistantChatRequest,
): Promise<AssistantChatResponse> {
  const payload = await apiPost<unknown, AssistantChatRequest>({
    path: '/assistant/chat',
    body: {
      ...request,
      funds: request.funds ? [...request.funds] : undefined,
    },
  });

  return parseAssistantChatResponse(payload);
}
