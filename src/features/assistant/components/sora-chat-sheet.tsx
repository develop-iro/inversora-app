import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
import { useAssistantExplain } from '@/features/assistant/hooks/use-assistant-explain';
import type { AssistantSurface } from '@/features/assistant/types/assistant-context';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { Layout, Radius, Spacing } from '@/shared/theme/theme';

export type SoraChatSheetProps = {
  visible: boolean;
  onClose: () => void;
  surface: AssistantSurface;
  fundIsin?: string;
  initialMessage?: string;
  quickPrompts?: readonly string[];
};

export function SoraChatSheet({
  visible,
  onClose,
  surface,
  fundIsin,
  initialMessage = '',
  quickPrompts = [],
}: SoraChatSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { explain, response, isLoading, errorMessage } = useAssistantExplain();
  const [message, setMessage] = useState(initialMessage);

  const handleSubmit = async (prompt: string) => {
    const trimmed = prompt.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setMessage(trimmed);

    await explain({
      surface,
      message: trimmed,
      fund: fundIsin ? { isin: fundIsin } : undefined,
      locale: 'es',
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
              Asistente educativo de Inversora
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

          {response ? (
            <SoraAnswerCard
              query={message}
              title={response.title ?? 'Respuesta de SORA'}
              body={response.text}
              source={response.source}
              disclaimer={response.disclaimer}
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
