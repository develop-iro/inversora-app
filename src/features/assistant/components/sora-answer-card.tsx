import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { AssistantResponseSource } from '@/features/assistant/types/assistant-context';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type SoraAnswerCardProps = {
  query: string;
  title: string;
  body: string;
  source: AssistantResponseSource;
  disclaimer?: string;
};

function resolveSourceLabel(source: AssistantResponseSource): string {
  switch (source) {
    case 'glossary':
      return 'Glosario Inversora';
    case 'cache':
      return 'Respuesta cacheada';
    case 'openai':
      return 'Asistida por IA';
    case 'mock':
      return 'Mock educativo';
    default:
      return 'Respuesta orientativa';
  }
}

export function SoraAnswerCard({
  query,
  title,
  body,
  source,
  disclaimer,
}: SoraAnswerCardProps) {
  const theme = useTheme();
  const sourceLabel = resolveSourceLabel(source);
  const resolvedDisclaimer =
    disclaimer ??
    'No es asesoramiento financiero personalizado. El rendimiento pasado no garantiza resultados futuros.';

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Respuesta de SORA para ${query}`}
      style={[
        styles.card,
        {
          backgroundColor: 'rgba(234, 248, 246, 0.66)',
          borderColor: 'rgba(0, 191, 166, 0.16)',
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: 'rgba(0, 191, 166, 0.14)' }]}>
          <MaterialCommunityIcons name="robot-outline" size={16} color={theme.deepOcean} />
        </View>
        <View style={styles.headerCopy}>
          <ThemedText type="metaLabel" themeColor="deepOcean">
            SORA · respuesta orientativa
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
            {sourceLabel}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="bodyBold">{title}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.body}>
        {body}
      </ThemedText>

      <ThemedText type="caption" themeColor="textSecondary" style={styles.disclaimer}>
        {resolvedDisclaimer}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  body: {
    lineHeight: 20,
  },
  disclaimer: {
    lineHeight: 17,
    opacity: 0.82,
  },
});
