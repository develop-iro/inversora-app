import { useCallback } from 'react';
import { View } from 'react-native';

import { useAssistantExplain } from '@/features/assistant/hooks/use-assistant-explain';
import { SoraAnswerCard } from '@/features/assistant/components/sora-answer-card';
import { TextParagraph } from '@/shared/components/text';
import { Button, Spinner } from '@/shared/components/ui';

export type FundDetailScoreExplainProps = {
  fundIsin: string;
  fundName: string;
};

const SCORE_EXPLAIN_MESSAGE =
  '¿Por qué este fondo tiene este score y posición en su categoría?';

/**
 * Inline SORA explain affordance for the fund score section (HU-23).
 */
export function FundDetailScoreExplain({ fundIsin, fundName }: FundDetailScoreExplainProps) {
  const { explain, response, isLoading, errorMessage, reset } = useAssistantExplain();

  const handleExplainScore = useCallback(async () => {
    reset();

    await explain({
      surface: 'fund-detail',
      message: SCORE_EXPLAIN_MESSAGE,
      fund: { isin: fundIsin },
      locale: 'es',
    });
  }, [explain, fundIsin, reset]);

  return (
    <View className="gap-sm">
      <Button
        variant="secondary"
        label={isLoading ? 'Consultando a SORA…' : '¿Por qué este score?'}
        accessibilityLabel="Preguntar a SORA por qué este fondo tiene este score"
        onPress={() => {
          void handleExplainScore();
        }}
        disabled={isLoading}
      />

      {isLoading ? (
        <View className="items-start py-xs">
          <Spinner accessibilityLabel="Generando explicación de SORA" />
        </View>
      ) : null}

      {errorMessage ? (
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {errorMessage}
        </TextParagraph>
      ) : null}

      {response ? (
        <SoraAnswerCard
          query={SCORE_EXPLAIN_MESSAGE}
          title={response.title ?? `Score de ${fundName}`}
          body={response.text}
          source={response.source}
          disclaimer={response.disclaimer}
          relatedFundIsin={response.relatedFundIsin}
        />
      ) : null}
    </View>
  );
}
