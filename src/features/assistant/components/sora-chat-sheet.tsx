import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SoraAnswerCard } from '@/features/assistant/components/sora-answer-card';
import { SoraChatComposer } from '@/features/assistant/components/sora-chat-composer';
import { SoraChatEmptyState } from '@/features/assistant/components/sora-chat-empty-state';
import { SoraChatTypingRow } from '@/features/assistant/components/sora-chat-typing-row';
import {
  resolveSoraContextChips,
  resolveSoraDefaultPrompts,
} from '@/features/assistant/components/sora-chat.utils';
import { useAssistantChat } from '@/features/assistant/hooks/use-assistant-chat';
import { useAssistantExplain } from '@/features/assistant/hooks/use-assistant-explain';
import type { AssistantSurface } from '@/features/assistant/types/assistant-context';
import { AppModalShell } from '@/shared/components/overlay';
import { TextParagraph } from '@/shared/components/text';
import { routes } from '@/shared/navigation/routes';
import { Layout } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type SoraChatSheetProps = {
  visible: boolean;
  onClose: () => void;
  surface: AssistantSurface;
  fundIsin?: string;
  fundIsins?: readonly string[];
  initialMessage?: string;
  quickPrompts?: readonly string[];
  conversationMode?: boolean;
};

function resolveFundPayload(
  fundIsin: string | undefined,
  fundIsins: readonly string[] | undefined,
): { fund?: { isin: string }; funds?: { isin: string }[] } {
  const merged = [
    ...(fundIsins ?? []),
    ...(fundIsin ? [fundIsin] : []),
  ].map((isin) => isin.trim().toUpperCase());

  const unique = [...new Set(merged)].filter((isin) => isin.length > 0);

  if (unique.length === 0) {
    return {};
  }

  if (unique.length === 1) {
    return { fund: { isin: unique[0] } };
  }

  return {
    funds: unique.map((isin) => ({ isin })),
  };
}

export function SoraChatSheet({
  visible,
  onClose,
  surface,
  fundIsin,
  fundIsins,
  initialMessage = '',
  quickPrompts = [],
  conversationMode = false,
}: SoraChatSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const explainState = useAssistantExplain();
  const chatState = useAssistantChat();
  const [message, setMessage] = useState(initialMessage);
  const scrollRef = useRef<ScrollView>(null);

  const isLoading = conversationMode ? chatState.isLoading : explainState.isLoading;
  const errorMessage = conversationMode
    ? chatState.errorMessage
    : explainState.errorMessage;

  const contextChips = useMemo(
    () => resolveSoraContextChips(surface, fundIsin, fundIsins),
    [surface, fundIsin, fundIsins],
  );

  const resolvedPrompts = useMemo(() => {
    if (quickPrompts.length > 0) {
      return quickPrompts;
    }

    return resolveSoraDefaultPrompts(surface);
  }, [quickPrompts, surface]);

  const hasConversationContent = conversationMode
    ? chatState.turns.length > 0
    : Boolean(explainState.response);

  const showEmptyState = conversationMode && chatState.turns.length === 0 && !isLoading;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    scrollToBottom();
  }, [visible, chatState.turns.length, explainState.response, isLoading, scrollToBottom]);

  const handleRelatedFundPress = (isin: string) => {
    onClose();
    router.push(routes.fundDetail(isin));
  };

  const handleSubmit = async (prompt: string) => {
    const trimmed = prompt.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const fundPayload = resolveFundPayload(fundIsin, fundIsins);

    try {
      if (conversationMode) {
        setMessage('');
        await chatState.sendMessage({
          surface,
          message: trimmed,
          locale: 'es',
          ...fundPayload,
        });
        return;
      }

      setMessage(trimmed);
      await explainState.explain({
        surface,
        message: trimmed,
        locale: 'es',
        ...fundPayload,
      });
    } catch {
      // The assistant hooks own the user-facing error state.
    }
  };

  const composerSuggestedPrompts =
    showEmptyState || hasConversationContent ? [] : resolvedPrompts.slice(0, 2);

  return (
    <AppModalShell
      visible={visible}
      onClose={onClose}
      title="SORA"
      subtitle="Asistente educativo · contexto de pantalla activo"
      keyboardAvoiding
      body={
        <ScrollView
          ref={scrollRef}
          className="flex-1 bg-background-soft"
          contentContainerClassName={cn(
            'gap-md px-lg pb-lg pt-md',
            showEmptyState && 'flex-grow',
          )}
          contentContainerStyle={{ paddingHorizontal: Layout.screenPaddingHorizontal }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={scrollToBottom}
        >
          {showEmptyState ? (
            <SoraChatEmptyState
              prompts={resolvedPrompts}
              onPromptPress={(prompt) => {
                void handleSubmit(prompt);
              }}
            />
          ) : null}

          {conversationMode
            ? chatState.turns.map((turn) =>
                turn.role === 'user' ? (
                  <View
                    key={turn.id}
                    className="max-w-[88%] self-end rounded-[18px] rounded-br-xs bg-deep-ocean px-md py-sm"
                  >
                    <TextParagraph variant="secondary" themeColor="textOnDark">
                      {turn.message}
                    </TextParagraph>
                  </View>
                ) : turn.response ? (
                  <SoraAnswerCard
                    key={turn.id}
                    query={turn.message}
                    title={turn.response.title ?? 'Respuesta de SORA'}
                    body={turn.response.text}
                    source={turn.response.source}
                    disclaimer={turn.response.disclaimer}
                    relatedFundIsin={turn.response.relatedFundIsin}
                    onRelatedFundPress={handleRelatedFundPress}
                    variant="message"
                  />
                ) : null,
              )
            : null}

          {!conversationMode && explainState.response ? (
            <>
              <View className="max-w-[88%] self-end rounded-[18px] rounded-br-xs bg-deep-ocean px-md py-sm">
                <TextParagraph variant="secondary" themeColor="textOnDark">
                  {message}
                </TextParagraph>
              </View>
              <SoraAnswerCard
                query={message}
                title={explainState.response.title ?? 'Respuesta de SORA'}
                body={explainState.response.text}
                source={explainState.response.source}
                disclaimer={explainState.response.disclaimer}
                relatedFundIsin={explainState.response.relatedFundIsin}
                onRelatedFundPress={handleRelatedFundPress}
                variant="message"
              />
            </>
          ) : null}

          {isLoading ? <SoraChatTypingRow /> : null}

          {errorMessage ? (
            <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-5">
              {errorMessage}
            </TextParagraph>
          ) : null}
        </ScrollView>
      }
      footer={
        <View style={{ paddingBottom: insets.bottom }}>
          <SoraChatComposer
            value={message}
            onChangeText={setMessage}
            onSubmit={() => {
              void handleSubmit(message);
            }}
            contextChips={contextChips}
            suggestedPrompts={composerSuggestedPrompts}
            onSuggestedPromptPress={(prompt) => {
              void handleSubmit(prompt);
            }}
            isLoading={isLoading}
          />
        </View>
      }
    />
  );
}
