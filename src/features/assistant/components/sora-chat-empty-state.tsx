import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type SoraChatEmptyStateProps = {
  prompts: readonly string[];
  onPromptPress: (prompt: string) => void;
};

/**
 * Welcome state shown before the first message in a SORA conversation.
 */
export function SoraChatEmptyState({ prompts, onPromptPress }: SoraChatEmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryIconSurface }]}>
        <MaterialCommunityIcons name="creation" size={28} color={theme.deepOcean} />
      </View>

      <TextHeading variant="section" style={styles.title}>
        ¿En qué puedo ayudarte?
      </TextHeading>
      <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.message}>
        Pregunta conceptos, métricas o diferencias usando el contexto de esta pantalla.
      </TextParagraph>

      <View style={styles.prompts}>
        {prompts.map((prompt) => (
          <Pressable
            key={prompt}
            accessibilityRole="button"
            accessibilityLabel={`Preguntar: ${prompt}`}
            onPress={() => onPromptPress(prompt)}
            style={({ pressed }) => [
              styles.promptChip,
              {
                borderColor: theme.border,
                backgroundColor: theme.surface,
              },
              pressed && styles.promptChipPressed,
            ]}
          >
            <TextParagraph variant="secondary">{prompt}</TextParagraph>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
    minHeight: 280,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  prompts: {
    width: '100%',
    marginTop: Spacing.md,
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
