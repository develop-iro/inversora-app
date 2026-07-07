import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { HomeRankingRow } from '@/features/onboarding/components/home-ranking-row';
import { HomeRankingThemeFilters } from '@/features/onboarding/components/home-ranking-theme-filters';
import { HomeSearchAnswerCard } from '@/features/onboarding/components/home-search-answer-card';
import { HomeSectionCard } from '@/features/onboarding/components/home-section-card';
import type { HomeSectionLoadState } from '@/features/onboarding/hooks/use-home-screen-data';
import type { HomeSearchResult } from '@/features/onboarding/services/resolve-home-search';
import type { RankingThemeOption } from '@/features/onboarding/utils/build-ranking-theme-options';
import { TextParagraph } from '@/shared/components/text';
import { ContentEmptyState } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';

export type HomeDynamicRankingSectionProps = {
  result: HomeSearchResult | null;
  loadState: HomeSectionLoadState;
  hasQuery: boolean;
  onRetry?: () => void;
  /** When true, shows the observational full ranking (home Ranking tab). */
  isFullRanking?: boolean;
  rankingThemes?: readonly RankingThemeOption[];
  selectedRankingTheme?: string | 'all';
  onRankingThemeChange?: (themeId: string | 'all') => void;
};

function resolveRankingSectionCopy(
  result: HomeSearchResult | null,
  isFullRanking: boolean,
  hasQuery: boolean,
): { title: string; summary: string } {
  const title =
    result?.kind === 'fund-match'
      ? 'Coincidencias en el ranking'
      : result?.kind === 'answer'
        ? 'Ranking relacionado'
        : 'Ranking Inversora';

  const summary =
    result?.subtitle ??
    (isFullRanking
      ? 'Observa el orden educativo del Score Inversora. No es una recomendación personalizada.'
      : 'Descubre los fondos mejor puntuados según el Score Inversora.');

  if (hasQuery && result?.kind === 'fund-match') {
    return {
      title,
      summary: `Hemos encontrado ${result.funds.length} fondo${result.funds.length === 1 ? '' : 's'} para «${result.query}».`,
    };
  }

  return { title, summary };
}

export function HomeDynamicRankingSection({
  result,
  loadState,
  hasQuery,
  onRetry,
  isFullRanking = false,
  rankingThemes = [],
  selectedRankingTheme = 'all',
  onRankingThemeChange,
}: HomeDynamicRankingSectionProps) {
  const router = useRouter();
  const theme = useTheme();

  const { title, summary } = resolveRankingSectionCopy(result, isFullRanking, hasQuery);

  const highlightLabel =
    result?.kind === 'fund-match' ? 'Mejor coincidencia' : 'Top fondo';

  const skeletonRows = isFullRanking ? (hasQuery ? 6 : 10) : hasQuery ? 2 : 3;

  if (loadState === 'loading') {
    return (
      <HomeSectionCard title={title} summary={summary} headerPlacement="inside">
        <View className="gap-sm pt-half">
          {Array.from({ length: skeletonRows }, (_, index) => (
            <HomeRankingRow key={`ranking-loading-${index}`} loading />
          ))}
        </View>
      </HomeSectionCard>
    );
  }

  if (loadState === 'error') {
    return (
      <HomeSectionCard title={title} summary={summary} headerPlacement="inside">
        <ContentEmptyState
          icon="chart-timeline-variant-shimmer"
          title="El ranking no ha podido cargarse"
          message="Puede ser un problema temporal de conexión. Inténtalo de nuevo en unos segundos."
          actionLabel="Reintentar"
          onAction={onRetry}
        />
      </HomeSectionCard>
    );
  }

  return (
    <HomeSectionCard title={title} summary={summary} headerPlacement="inside">
      {result?.kind === 'answer' ? (
        <HomeSearchAnswerCard query={result.query} answer={result.answer} />
      ) : null}

      {isFullRanking && !hasQuery && onRankingThemeChange ? (
        <HomeRankingThemeFilters
          themes={rankingThemes}
          selectedThemeId={selectedRankingTheme}
          onThemeChange={onRankingThemeChange}
        />
      ) : null}

      {loadState === 'empty' || (result && result.funds.length === 0) ? (
        <ContentEmptyState
          icon={hasQuery ? 'magnify-close' : 'finance'}
          title={hasQuery ? 'Sin coincidencias en el ranking' : 'Sin fondos en esta temática'}
          message={
            hasQuery
              ? 'Prueba con el nombre completo, el ISIN o formula una pregunta educativa.'
              : selectedRankingTheme !== 'all'
                ? 'Prueba otra temática o vuelve a «Todos» para ver el ranking completo.'
                : 'Aún no hay fondos disponibles para mostrar en esta sección.'
          }
          actionLabel={hasQuery ? undefined : selectedRankingTheme !== 'all' ? 'Ver todas' : 'Explorar catálogo'}
          onAction={
            hasQuery
              ? undefined
              : selectedRankingTheme !== 'all'
                ? () => onRankingThemeChange?.('all')
                : () => {
                    router.push(routes.fundsCatalog);
                  }
          }
          className="self-stretch py-lg"
        />
      ) : null}

      {result && result.funds.length > 0 ? (
        <View className="gap-sm pt-half">
          {result.funds.map((fund) => (
            <HomeRankingRow
              key={fund.isin}
              fund={fund}
              highlightLabel={highlightLabel}
              onPress={() => {
                router.push(routes.fundDetail(fund.isin));
              }}
            />
          ))}
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver ranking completo"
        accessibilityHint="Navega al listado completo de fondos"
        onPress={() => {
          router.push(routes.fundsCatalog);
        }}
        className="mt-xs min-h-[44px] flex-row items-center gap-xs self-start rounded-pill border px-md py-sm active:opacity-[0.85]"
        style={{
          borderColor: theme.primary,
          backgroundColor: theme.backgroundSoft,
        }}
      >
        <TextParagraph variant="secondary" themeColor="primary" className="leading-5">
          Ver ranking completo
        </TextParagraph>
        <MaterialCommunityIcons name="arrow-right" size={16} color={theme.primary} />
      </Pressable>
    </HomeSectionCard>
  );
}
