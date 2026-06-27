import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SoraAnswerCard } from '@/features/assistant/components/sora-answer-card';
import { useAssistantChat } from '@/features/assistant/hooks/use-assistant-chat';
import { useAssistantExplain } from '@/features/assistant/hooks/use-assistant-explain';
import type { AssistantSurface } from '@/features/assistant/types/assistant-context';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { routes } from '@/shared/navigation/routes';
import { useTheme } from '@/shared/hooks/use-theme';
import { Layout, Radius, Spacing } from '@/shared/theme/theme';

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
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const explainState = useAssistantExplain();
  const chatState = useAssistantChat();
  const [message, setMessage] = useState(initialMessage);

  const isLoading = conversationMode ? chatState.isLoading : explainState.isLoading;
  const errorMessage = conversationMode
    ? chatState.errorMessage
    : explainState.errorMessage;

  const handleRelatedFundPress = (isin: string) => {
    onClose();
    router.push(routes.fundDetail(isin));
  };

  const handleSubmit = async (prompt: string) => {
    const trimmed = prompt.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setMessage(trimmed);
    const fundPayload = resolveFundPayload(fundIsin, fundIsins);

    if (conversationMode) {
      await chatState.sendMessage({
        surface,
        message: trimmed,
        locale: 'es',
        ...fundPayload,
      });
      return;
    }

    await explainState.explain({
      surface,
      message: trimmed,
      locale: 'es',
      ...fundPayload,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + Spacing.sm,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <View style={styles.headerCopy}>
            <ThemedText type="sectionTitle">SORA</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {conversationMode
                ? 'Conversación educativa con contexto de pantalla'
                : 'Asistente educativo de Inversora'}
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar asistente SORA"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
          >
            <MaterialCommunityIcons name="close" size={20} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {quickPrompts.length > 0 ? (
            <View style={styles.quickPrompts}>
              {quickPrompts.map((prompt) => (
                <Pressable
                  key={prompt}
                  accessibilityRole="button"
                  accessibilityLabel={`Preguntar a SORA: ${prompt}`}
                  onPress={() => {
                    void handleSubmit(prompt);
                  }}
                  style={({ pressed }) => [
                    styles.promptChip,
                    { borderColor: theme.border, backgroundColor: theme.surface },
                    pressed && styles.promptChipPressed,
                  ]}
                >
                  <ThemedText type="caption">{prompt}</ThemedText>
                </Pressable>
              ))}
            </View>
          ) : null}

          {conversationMode
            ? chatState.turns.map((turn) =>
                turn.role === 'user' ? (
                  <View
                    key={turn.id}
                    style={[styles.userBubble, { backgroundColor: theme.surface }]}
                  >
                    <ThemedText type="caption">{turn.message}</ThemedText>
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
                  />
                ) : null,
              )
            : null}

          <View style={styles.inputBlock}>
            <TextInput
              accessibilityLabel="Escribe tu pregunta para SORA"
              placeholder="Pregunta sobre conceptos, score o comparación..."
              placeholderTextColor={theme.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                },
              ]}
            />
            <Button
              label={isLoading ? 'Consultando...' : 'Preguntar a SORA'}
              onPress={() => {
                void handleSubmit(message);
              }}
              disabled={isLoading || message.trim().length === 0}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator color={theme.primary} style={styles.loader} />
          ) : null}

          {errorMessage ? (
            <ThemedText type="caption" themeColor="textSecondary">
              {errorMessage}
            </ThemedText>
          ) : null}

          {!conversationMode && explainState.response ? (
            <SoraAnswerCard
              query={message}
              title={explainState.response.title ?? 'Respuesta de SORA'}
              body={explainState.response.text}
              source={explainState.response.source}
              disclaimer={explainState.response.disclaimer}
              relatedFundIsin={explainState.response.relatedFundIsin}
              onRelatedFundPress={handleRelatedFundPress}
            />
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    opacity: 0.75,
  },
  content: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  promptChip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: '100%',
  },
  promptChipPressed: {
    opacity: 0.85,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '92%',
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputBlock: {
    gap: Spacing.sm,
  },
  input: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    textAlignVertical: 'top',
  },
  loader: {
    marginVertical: Spacing.sm,
  },
});
