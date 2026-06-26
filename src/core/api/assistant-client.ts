import { apiPost } from '@/core/api/client';
import { parseAssistantExplainResponse } from '@/core/api/parse-assistant-response';
import type {
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
