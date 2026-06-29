import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { palette } from '@/shared/theme/palette';
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
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.softTealBackground,
          borderColor: 'rgba(0, 191, 166, 0.18)',
        },
      ]}
    >
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="creation" size={20} color={theme.primary} />
        <ThemedText type="bodyBold">Pregunta a SORA</ThemedText>
      </View>

      <ThemedText type="caption" themeColor="textSecondary">
        SORA puede explicar diferencias de TER, score y categoría usando solo los datos visibles
        en esta comparación.
      </ThemedText>

      {canAskSora && visiblePrompts.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptsScroll}
        >
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
              <ThemedText type="caption" numberOfLines={2}>
                {prompt}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <Button
        label="Abrir chat de comparación"
        onPress={() => onOpenChat()}
        disabled={!canAskSora}
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  promptsScroll: {
    gap: Spacing.sm,
  },
  promptChip: {
    maxWidth: 220,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  promptChipPressed: {
    opacity: 0.88,
  },
});
