import { useCallback, useRef, useState } from 'react';

import { chatAssistant } from '@/core/api/assistant-client';
import { AppError } from '@/core/errors/app-error';
import type {
  AssistantChatRequest,
  AssistantChatTurn,
} from '@/features/assistant/types/assistant-context';

type UseAssistantChatState = {
  turns: AssistantChatTurn[];
  sessionId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
};

function createTurnId(): string {
  return `turn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Hook for multi-turn SORA chat requests via `POST /assistant/chat`.
 */
export function useAssistantChat() {
  const sessionIdRef = useRef<string | null>(null);
  const [state, setState] = useState<UseAssistantChatState>({
    turns: [],
    sessionId: null,
    isLoading: false,
    errorMessage: null,
  });

  const reset = useCallback(() => {
    sessionIdRef.current = null;
    setState({
      turns: [],
      sessionId: null,
      isLoading: false,
      errorMessage: null,
    });
  }, []);

  const sendMessage = useCallback(async (request: AssistantChatRequest) => {
    const trimmed = request.message.trim();

    if (!trimmed) {
      return null;
    }

    const userTurn: AssistantChatTurn = {
      id: createTurnId(),
      role: 'user',
      message: trimmed,
    };

    setState((current) => ({
      ...current,
      turns: [...current.turns, userTurn],
      isLoading: true,
      errorMessage: null,
    }));

    try {
      const response = await chatAssistant({
        ...request,
        message: trimmed,
        sessionId: sessionIdRef.current ?? request.sessionId,
      });

      if (response.sessionId) {
        sessionIdRef.current = response.sessionId;
      }

      const assistantTurn: AssistantChatTurn = {
        id: createTurnId(),
        role: 'assistant',
        message: response.title ?? 'Respuesta de SORA',
        response,
      };

      setState((current) => ({
        turns: [...current.turns, assistantTurn],
        sessionId: sessionIdRef.current,
        isLoading: false,
        errorMessage: null,
      }));

      return response;
    } catch (error) {
      const message =
        error instanceof AppError
          ? error.message
          : 'SORA no pudo responder en este momento.';

      setState((current) => ({
        ...current,
        isLoading: false,
        errorMessage: message,
      }));

      throw error;
    }
  }, []);

  return {
    ...state,
    sendMessage,
    reset,
  };
}
