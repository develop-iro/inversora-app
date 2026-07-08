import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { AssistantResponseSource } from '@/features/assistant/types/assistant-context';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type SoraAnswerCardProps = {
  query: string;
  title: string;
  body: string;
  source: AssistantResponseSource;
  disclaimer?: string;
  relatedFundIsin?: string;
  onRelatedFundPress?: (isin: string) => void;
  /** `message` aligns the card as an assistant chat bubble. */
  variant?: 'card' | 'message';
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
      return 'Respuesta offline';
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
  relatedFundIsin,
  onRelatedFundPress,
  variant = 'card',
}: SoraAnswerCardProps) {
  const theme = useTheme();
  const sourceLabel = resolveSourceLabel(source);
  const isMessage = variant === 'message';
  const resolvedDisclaimer =
    disclaimer ??
    'No es asesoramiento financiero personalizado. El rendimiento pasado no garantiza resultados futuros.';

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Respuesta de SORA para ${query}`}
      style={[
        styles.card,
        isMessage && styles.messageCard,
        {
          backgroundColor: isMessage ? theme.surface : theme.softTealSurface,
          borderColor: isMessage ? theme.border : theme.primaryBorderSubtle,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: theme.primaryIconSurface }]}>
          <MaterialCommunityIcons name="robot-outline" size={16} color={theme.deepOcean} />
        </View>
        <View style={styles.headerCopy}>
          <TextLabel variant="meta" themeColor="deepOcean">
            SORA · respuesta orientativa
          </TextLabel>
          <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={2}>
            {sourceLabel}
          </TextParagraph>
        </View>
      </View>

      <TextHeading variant="section">{title}</TextHeading>
      <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.body}>
        {body}
      </TextParagraph>

      {relatedFundIsin && onRelatedFundPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver ficha del fondo ${relatedFundIsin}`}
          onPress={() => onRelatedFundPress(relatedFundIsin)}
          style={({ pressed }) => [styles.relatedLink, pressed && styles.relatedLinkPressed]}
        >
          <TextParagraph variant="secondary" themeColor="deepOcean">
            Ver fondo relacionado ({relatedFundIsin})
          </TextParagraph>
        </Pressable>
      ) : null}

      <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.disclaimer}>
        {resolvedDisclaimer}
      </TextParagraph>
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
  messageCard: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    borderBottomLeftRadius: 6,
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
    gap: Spacing.half,
  },
  body: {
    lineHeight: 20,
  },
  relatedLink: {
    alignSelf: 'flex-start',
  },
  relatedLinkPressed: {
    opacity: 0.8,
  },
  disclaimer: {
    lineHeight: 17,
    opacity: 0.82,
  },
});
