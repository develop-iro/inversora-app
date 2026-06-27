import { useCallback, useState } from 'react';

import { explainAssistant } from '@/core/api/assistant-client';
import { AppError } from '@/core/errors/app-error';
import type {
  AssistantExplainRequest,
  AssistantExplainResponse,
} from '@/features/assistant/types/assistant-context';

type UseAssistantExplainState = {
  response: AssistantExplainResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
};

/**
 * Hook for single-turn SORA assistant explain requests.
 */
export function useAssistantExplain() {
  const [state, setState] = useState<UseAssistantExplainState>({
    response: null,
    isLoading: false,
    errorMessage: null,
  });

  const reset = useCallback(() => {
    setState({
      response: null,
      isLoading: false,
      errorMessage: null,
    });
  }, []);

  const explain = useCallback(async (request: AssistantExplainRequest) => {
    setState((current) => ({
      ...current,
      isLoading: true,
      errorMessage: null,
    }));

    try {
      const response = await explainAssistant(request);

      setState({
        response,
        isLoading: false,
        errorMessage: null,
      });

      return response;
    } catch (error) {
      const message =
        error instanceof AppError
          ? error.message
          : 'SORA no pudo responder en este momento.';

      setState({
        response: null,
        isLoading: false,
        errorMessage: message,
      });

      throw error;
    }
  }, []);

  return {
    ...state,
    explain,
    reset,
  };
}
