import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Layout, Typography } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type SoraChatComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  contextChips: readonly string[];
  suggestedPrompts?: readonly string[];
  onSuggestedPromptPress?: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
};

/**
 * IDE-style chat composer: context chips, multiline input, and inline send control.
 */
export function SoraChatComposer({
  value,
  onChangeText,
  onSubmit,
  contextChips,
  suggestedPrompts = [],
  onSuggestedPromptPress,
  isLoading = false,
  placeholder = 'Pregunta sobre conceptos, score o comparación…',
}: SoraChatComposerProps) {
  const theme = useTheme();
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isLoading;

  return (
    <View
      className="gap-xs border-t border-border-subtle pt-sm"
      style={{ paddingHorizontal: Layout.screenPaddingHorizontal, paddingBottom: 8 }}
    >
      <View className="gap-sm rounded-card border border-border bg-surface p-md shadow-card">
        <View className="flex-row flex-wrap gap-xs">
          {contextChips.map((chip) => (
            <View
              key={chip}
              className="max-w-full rounded-pill border border-border-subtle bg-surface-muted px-sm py-half"
            >
              <TextLabel variant="meta" themeColor="textSecondary" numberOfLines={1}>
                {chip}
              </TextLabel>
            </View>
          ))}
        </View>

        <TextInput
          accessibilityLabel="Escribe tu pregunta para SORA"
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          multiline
          className="min-h-[44px] max-h-[120px] py-0 text-text"
          // tailwind-exception: TextInput uses theme typography tokens for font metrics
          style={{
            fontFamily: Typography.body.fontFamily,
            fontSize: Typography.body.fontSize,
            lineHeight: Typography.body.lineHeight,
            color: theme.text,
          }}
          textAlignVertical="top"
          onSubmitEditing={() => {
            if (canSend) {
              onSubmit();
            }
          }}
        />

        <View className="flex-row items-end justify-between gap-sm">
          <View className="min-w-0 flex-1 flex-row flex-wrap gap-xs">
            {suggestedPrompts.slice(0, 3).map((prompt) => (
              <Pressable
                key={prompt}
                accessibilityRole="button"
                accessibilityLabel={`Sugerencia: ${prompt}`}
                onPress={() => onSuggestedPromptPress?.(prompt)}
                className="max-w-full rounded-pill border border-border bg-background px-sm py-half active:opacity-[0.86]"
              >
                <TextParagraph variant="secondary" numberOfLines={1}>
                  {prompt}
                </TextParagraph>
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isLoading ? 'Consultando con SORA' : 'Enviar pregunta'}
            accessibilityState={{ disabled: !canSend }}
            onPress={onSubmit}
            disabled={!canSend}
            className={cn(
              'h-9 w-9 shrink-0 items-center justify-center rounded-full active:opacity-90',
              canSend ? 'bg-deep-ocean' : 'bg-surface-muted',
            )}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.textOnDark} />
            ) : (
              <MaterialCommunityIcons
                name="arrow-up"
                size={18}
                color={canSend ? theme.textOnDark : theme.textSecondary}
              />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
