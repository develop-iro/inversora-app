import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { AssistantResponseSource } from '@/features/assistant/types/assistant-context';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

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
      className={cn(
        'gap-sm rounded-card border px-md py-md',
        isMessage
          ? 'max-w-[92%] self-start rounded-bl-xs border-border bg-surface'
          : 'border-primary-border-subtle bg-soft-teal-surface',
      )}
    >
      <View className="flex-row items-start gap-sm">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-icon-surface">
          <MaterialCommunityIcons name="robot-outline" size={16} color={theme.deepOcean} />
        </View>
        <View className="flex-1 gap-half">
          <TextLabel variant="meta" themeColor="deepOcean">
            SORA · respuesta orientativa
          </TextLabel>
          <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={2}>
            {sourceLabel}
          </TextParagraph>
        </View>
      </View>

      <TextHeading variant="section">{title}</TextHeading>
      <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-5">
        {body}
      </TextParagraph>

      {relatedFundIsin && onRelatedFundPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver ficha del fondo ${relatedFundIsin}`}
          onPress={() => onRelatedFundPress(relatedFundIsin)}
          className="self-start active:opacity-80"
        >
          <TextParagraph variant="secondary" themeColor="deepOcean">
            Ver fondo relacionado ({relatedFundIsin})
          </TextParagraph>
        </Pressable>
      ) : null}

      <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-[17px] opacity-[0.82]">
        {resolvedDisclaimer}
      </TextParagraph>
    </View>
  );
}
