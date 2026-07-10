import { Pressable, View } from 'react-native';

import type { HomeSearchResult } from '@/features/onboarding/services/resolve-home-search';
import { HomeSearchAnswerCard } from '@/features/onboarding/components/home-search-answer-card';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type HomeExploreFundMatchPromptProps = {
  result: HomeSearchResult;
  onOpenRanking: () => void;
};

/**
 * Prompts the user to open the Ranking tab when a fund search match is found on Explorar.
 */
export function HomeExploreFundMatchPrompt({
  result,
  onOpenRanking,
}: HomeExploreFundMatchPromptProps) {
  const theme = useTheme();

  if (result.kind !== 'fund-match') {
    return null;
  }

  const matchCount = result.funds.length;

  return (
    <View className="gap-sm">
      <TextParagraph
        variant="secondary"
        themeColor="textSecondary"
        className="max-w-[620px] leading-5"
      >
        Hemos encontrado {matchCount} fondo{matchCount === 1 ? '' : 's'} para «{result.query}».
        Consulta el ranking para compararlos con criterios objetivos.
      </TextParagraph>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver coincidencias en el ranking"
        accessibilityHint="Cambia a la pestaña Ranking con los resultados filtrados"
        onPress={onOpenRanking}
        className="mt-xs min-h-[44px] self-start rounded-pill border px-lg py-sm active:opacity-[0.88]"
        style={{
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.border,
        }}
      >
        <TextParagraph variant="emphasis" themeColor="deepOcean">
          Ver en Ranking
        </TextParagraph>
      </Pressable>
    </View>
  );
}

export type HomeExploreAnswerSectionProps = {
  result: HomeSearchResult;
  loadState?: 'loading' | 'ready' | 'error' | 'empty';
  onRetry?: () => void;
};

/** Educational answer card for concept questions on the Explorar tab. */
export function HomeExploreAnswerSection({
  result,
  loadState = 'ready',
  onRetry,
}: HomeExploreAnswerSectionProps) {
  if (result.kind !== 'answer') {
    return null;
  }

  if (loadState === 'loading') {
    return (
      <TextParagraph variant="secondary" themeColor="textSecondary">
        Buscando una respuesta educativa…
      </TextParagraph>
    );
  }

  if (loadState === 'error') {
    return (
      <View className="gap-sm">
        <TextParagraph variant="secondary" themeColor="textSecondary">
          No pudimos obtener una respuesta de SORA. Comprueba tu conexión o inténtalo de nuevo.
        </TextParagraph>
        {onRetry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reintentar búsqueda educativa"
            onPress={onRetry}
            className="min-h-[44px] self-start rounded-pill border px-lg py-sm active:opacity-[0.88]"
          >
            <TextParagraph variant="emphasis" themeColor="deepOcean">
              Reintentar
            </TextParagraph>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return <HomeSearchAnswerCard query={result.query} answer={result.answer} />;
}
