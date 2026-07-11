import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

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
    <View className="min-h-[280px] flex-grow items-center justify-center gap-sm px-lg py-xl">
      <View className="mb-xs h-14 w-14 items-center justify-center rounded-full bg-primary-icon-surface">
        <MaterialCommunityIcons name="creation" size={28} color={theme.deepOcean} />
      </View>

      <TextHeading variant="section" className="text-center">
        ¿En qué puedo ayudarte?
      </TextHeading>
      <TextParagraph variant="secondary" themeColor="textSecondary" className="max-w-[300px] text-center leading-5">
        Pregunta conceptos, métricas o diferencias usando el contexto de esta pantalla.
      </TextParagraph>

      <View className="mt-md w-full gap-sm">
        {prompts.map((prompt) => (
          <Pressable
            key={prompt}
            accessibilityRole="button"
            accessibilityLabel={`Preguntar: ${prompt}`}
            onPress={() => onPromptPress(prompt)}
            className="rounded-pill border border-border bg-surface px-md py-sm active:opacity-[0.88]"
          >
            <TextParagraph variant="secondary">{prompt}</TextParagraph>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
