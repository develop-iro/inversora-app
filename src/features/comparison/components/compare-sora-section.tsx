import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { SectionCard } from '@/shared/components/layout';
import { TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CompareSoraSectionProps = {
  selectedIsins: readonly string[];
  quickPrompts: readonly string[];
  canAskSora: boolean;
  isSoraVisible: boolean;
  soraSession: number;
  soraInitialMessage?: string;
  onOpenChat: (initialMessage?: string) => void;
  onCloseChat: () => void;
};

/**
 * SORA entry point for qualitative comparison analysis.
 */
export function CompareSoraSection({
  selectedIsins,
  quickPrompts,
  canAskSora,
  isSoraVisible,
  soraSession,
  soraInitialMessage = '',
  onOpenChat,
  onCloseChat,
}: CompareSoraSectionProps) {
  const theme = useTheme();
  const visiblePrompts = quickPrompts.slice(0, 2);

  return (
    <SectionCard
      title="Pregunta a SORA"
      summary="Explica diferencias de TER, score y categoría con los datos visibles en esta comparación."
      surface="muted"
      contentStyle={styles.content}
    >
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="creation" size={20} color={theme.primary} />
        <TextParagraph variant="secondary" themeColor="textSecondary">
          Respuestas educativas, sin recomendación de inversión.
        </TextParagraph>
      </View>

      {canAskSora && visiblePrompts.length > 0 ? (
        <View style={styles.promptsRow}>
          {visiblePrompts.map((prompt) => (
            <Pressable
              key={prompt}
              accessibilityRole="button"
              accessibilityLabel={prompt}
              onPress={() => onOpenChat(prompt)}
              style={({ pressed }) => [
                styles.promptChip,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                },
                pressed && styles.promptChipPressed,
              ]}
            >
              <TextParagraph variant="secondary" numberOfLines={2}>
                {prompt}
              </TextParagraph>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Button
        label="Abrir chat de comparación"
        onPress={() => onOpenChat()}
        disabled={!canAskSora}
        fullWidth
      />

      <SoraChatSheet
        key={`compare-sora-${soraSession}`}
        visible={isSoraVisible}
        onClose={onCloseChat}
        surface="compare"
        fundIsins={selectedIsins}
        initialMessage={soraInitialMessage}
        conversationMode
        quickPrompts={quickPrompts}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  promptsRow: {
    gap: Spacing.sm,
  },
  promptChip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  promptChipPressed: {
    opacity: 0.88,
  },
});
