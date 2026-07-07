import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { getThemeShadows } from '@/shared/theme/shadows';
import { Layout, Radius, Spacing, Typography } from '@/shared/theme/theme';

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
  const shadows = getThemeShadows(theme);
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isLoading;

  return (
    <View style={[styles.root, { borderTopColor: theme.borderSubtle }]}>
      <View
        style={[
          styles.composerCard,
          shadows.elevated,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.contextRow}>
          {contextChips.map((chip) => (
            <View
              key={chip}
              style={[
                styles.contextChip,
                {
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                },
              ]}
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
          style={[styles.input, { color: theme.text }]}
          textAlignVertical="top"
          onSubmitEditing={() => {
            if (canSend) {
              onSubmit();
            }
          }}
        />

        <View style={styles.toolbar}>
          <View style={styles.suggestedRow}>
            {suggestedPrompts.slice(0, 3).map((prompt) => (
              <Pressable
                key={prompt}
                accessibilityRole="button"
                accessibilityLabel={`Sugerencia: ${prompt}`}
                onPress={() => onSuggestedPromptPress?.(prompt)}
                style={({ pressed }) => [
                  styles.suggestedChip,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  },
                  pressed && styles.suggestedChipPressed,
                ]}
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
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: canSend ? theme.deepOcean : theme.surfaceMuted,
              },
              pressed && canSend && styles.sendButtonPressed,
            ]}
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

      <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.hint}>
        Respuestas educativas. No es asesoramiento financiero personalizado.
      </TextParagraph>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  composerCard: {
    borderWidth: 1,
    borderRadius: Radius.card + 4,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  contextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  contextChip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.half,
    maxWidth: '100%',
  },
  input: {
    minHeight: 44,
    maxHeight: 120,
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    paddingVertical: 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  suggestedRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    minWidth: 0,
  },
  suggestedChip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.half,
    maxWidth: '100%',
  },
  suggestedChipPressed: {
    opacity: 0.86,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendButtonPressed: {
    opacity: 0.9,
  },
  hint: {
    textAlign: 'center',
    lineHeight: 16,
    fontSize: 11,
    opacity: 0.78,
  },
});
