import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';

import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import { getRankingsGrouped } from '@/features/funds/services/get-rankings';

import { HomeEducationalProfileCard } from '@/features/learn/components/home-educational-profile-card';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import {
  applyBeginnerGuardsToHomeSearchResult,
  filterBeginnerEligibleRankingGroups,
  shouldApplyBeginnerSurfaceGuards,
} from '@/features/funds/utils/beginner-eligibility';
import { FeaturedFundsCarousel } from '@/features/onboarding/components/featured-funds-carousel';
import {
  HomeExploreAnswerSection,
  HomeExploreFundMatchPrompt,
} from '@/features/onboarding/components/home-explore-search-results';
import { HomeDynamicRankingSection } from '@/features/onboarding/components/home-dynamic-ranking-section';
import { HomeHeroCarousel } from '@/features/onboarding/components/home-hero-carousel';
import { HomeNewsSection } from '@/features/onboarding/components/home-news-section';
import { HomeSectionCard } from '@/features/onboarding/components/home-section-card';
import { HomeStarterCard } from '@/features/onboarding/components/home-starter-card';
import {
  HOME_CONTENT_TABS,
  type HomeContentTab,
  type HomeHeroSlideAction,
} from '@/features/onboarding/constants/home-hero-slides';
import { useHomeScreenData } from '@/features/onboarding/hooks/use-home-screen-data';
import type { HomeSearchResult } from '@/features/onboarding/services/resolve-home-search';
import {
  buildRankingThemeOptionsFromGroups,
  formatRankingThemeLabel,
  getRankingFundsForBenchmark,
  toHomeRankingEntries,
} from '@/features/onboarding/utils/build-ranking-theme-options';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { TabScreenScroll } from '@/shared/components/layout';
import { ContentEmptyState, ReloadState, SearchField, TabPill } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();
  const [activeTab, setActiveTab] = useState<HomeContentTab>('explore');
  const [selectedRankingTheme, setSelectedRankingTheme] = useState<string | 'all'>('all');
  const [rankingGroups, setRankingGroups] = useState<BenchmarkRankingGroup[]>([]);
  const {
    searchQuery,
    hasQuery,
    handleSearchChange,
    featuredFunds,
    featuredState,
    newsItems,
    newsState,
    activeRanking,
    rankingState,
    isRefreshing,
    refreshHome,
    retryFeatured,
    retryNews,
    retryActiveRanking,
  } = useHomeScreenData();
  const { profile: educationalProfile, isLoading: isProfileLoading } = useEducationalProfile();
  const applyBeginnerGuards = shouldApplyBeginnerSurfaceGuards(educationalProfile);

  const guardedRankingGroups = useMemo(
    () =>
      applyBeginnerGuards
        ? filterBeginnerEligibleRankingGroups(rankingGroups)
        : rankingGroups,
    [applyBeginnerGuards, rankingGroups],
  );

  const guardedActiveRanking = useMemo(
    () =>
      applyBeginnerGuards
        ? applyBeginnerGuardsToHomeSearchResult(activeRanking)
        : activeRanking,
    [activeRanking, applyBeginnerGuards],
  );

  const handleOpenSuggestedCatalog = useCallback(() => {
    router.push(routes.fundsCatalogWithProfileHints);
  }, [router]);

  const handleOpenLegal = useCallback(() => {
    router.push(routes.legal);
  }, [router]);

  const handleLearnPress = useCallback(() => {
    router.push(routes.learn);
  }, [router]);

  const handleHeroAction = useCallback(
    (action: HomeHeroSlideAction) => {
      switch (action) {
        case 'learn':
          router.push(routes.learn);
          break;
        case 'funds':
          router.push(routes.fundsCatalog);
          break;
        case 'compare':
          router.push(routes.compare);
          break;
        default: {
          const exhaustiveCheck: never = action;
          return exhaustiveCheck;
        }
      }
    },
    [router],
  );

  const handleOpenRankingTab = useCallback(() => {
    setActiveTab('ranking');
  }, []);

  useEffect(() => {
    let cancelled = false;

    void getRankingsGrouped()
      .then((groups) => {
        if (!cancelled) {
          setRankingGroups(groups);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRankingGroups([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveRankingTheme =
    hasQuery || activeTab !== 'ranking' ? 'all' : selectedRankingTheme;

  const rankingThemeOptions = useMemo(
    () => buildRankingThemeOptionsFromGroups(guardedRankingGroups),
    [guardedRankingGroups],
  );

  const filteredRankingResult = useMemo((): HomeSearchResult | null => {
    if (!guardedActiveRanking) {
      return null;
    }

    if (effectiveRankingTheme === 'all' || hasQuery || guardedRankingGroups.length === 0) {
      return guardedActiveRanking;
    }

    const selectedGroup = guardedRankingGroups.find(
      (group) => group.benchmarkKey === effectiveRankingTheme,
    );
    const filteredFunds = toHomeRankingEntries(
      getRankingFundsForBenchmark(guardedRankingGroups, effectiveRankingTheme),
    );

    return {
      ...guardedActiveRanking,
      funds: filteredFunds,
      subtitle: selectedGroup
        ? `Observa el ranking de ${selectedGroup.benchmark} (${selectedGroup.total} comparables) según el Score Inversora.`
        : `Observa el ranking de ${formatRankingThemeLabel(effectiveRankingTheme)} según el Score Inversora.`,
    };
  }, [guardedActiveRanking, effectiveRankingTheme, hasQuery, guardedRankingGroups]);

  const showExploreDefault = activeTab === 'explore' && !hasQuery;
  const showExploreSearchResults = activeTab === 'explore' && hasQuery && guardedActiveRanking;
  const showExploreSearchError = activeTab === 'explore' && hasQuery && rankingState === 'error';

  return (
    <TabScreenScroll
      contentContainerClassName="gap-lg self-center pt-xs"
      contentContainerStyle={{
        width: contentWidth,
        maxWidth: contentWidth,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            void refreshHome();
          }}
          tintColor={theme.primary}
          colors={[theme.primary]}
          progressBackgroundColor={theme.surface}
        />
      }
    >
        <HomeHeroCarousel onSlideAction={handleHeroAction} />

        <HomeSectionCard contentClassName="py-md">
          <SearchField
            variant="plain"
            accessibilityLabel="Buscar conceptos o fondos"
            placeholder="Buscar conceptos o fondos..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </HomeSectionCard>

        <View className="px-lg">
          <TabPill
            tabs={HOME_CONTENT_TABS}
            value={activeTab}
            onChange={setActiveTab}
            accessibilityLabel="Secciones del inicio"
          />
        </View>

        {activeTab === 'explore' ? (
          <>
            {showExploreSearchError ? (
              <HomeSectionCard title="No pudimos resolver tu búsqueda">
                <ReloadState
                  title="SORA no está disponible"
                  message="No pudimos obtener una respuesta educativa ni actualizar el ranking. Comprueba tu conexión o inténtalo de nuevo."
                  onAction={() => {
                    void retryActiveRanking();
                  }}
                />
              </HomeSectionCard>
            ) : null}

            {showExploreSearchResults && guardedActiveRanking.kind === 'answer' ? (
              <HomeSectionCard
                title="Respuesta educativa"
                summary="Contexto sobre tu consulta, sin recomendaciones personalizadas."
              >
                <HomeExploreAnswerSection
                  result={guardedActiveRanking}
                  loadState={rankingState}
                  onRetry={() => {
                    void retryActiveRanking();
                  }}
                />
              </HomeSectionCard>
            ) : null}

            {showExploreSearchResults && guardedActiveRanking.kind === 'fund-match' ? (
              <HomeSectionCard title="Coincidencias en el ranking">
                <HomeExploreFundMatchPrompt
                  result={guardedActiveRanking}
                  onOpenRanking={handleOpenRankingTab}
                />
              </HomeSectionCard>
            ) : null}

            {showExploreDefault ? (
              <>
                {!isProfileLoading && educationalProfile ? (
                  <HomeSectionCard title="Tu perfil educativo" borderless contentClassName="p-0">
                    <HomeEducationalProfileCard
                      profile={educationalProfile}
                      onOpenSuggestedCatalog={handleOpenSuggestedCatalog}
                      onRetakeQuestionnaire={handleLearnPress}
                    />
                  </HomeSectionCard>
                ) : null}

                <HomeSectionCard title="Para empezar" borderless contentClassName="p-0">
                  <View className="w-full flex-row items-stretch gap-md">
                    <HomeStarterCard
                      title="Conceptos básicos"
                      iconName="book-open-page-variant-outline"
                      accessibilityLabel="Conceptos básicos, abrir guía educativa"
                      accessibilityHint="Inicia el cuestionario para aprender sobre fondos indexados"
                      onPress={handleLearnPress}
                    />
                    <HomeStarterCard
                      title="Ver ranking educativo"
                      iconName="chart-line"
                      accessibilityLabel="Ver ranking educativo, abrir pestaña Ranking"
                      accessibilityHint="Muestra el ranking observacional del Score Inversora"
                      onPress={handleOpenRankingTab}
                    />
                  </View>
                </HomeSectionCard>

                <HomeSectionCard
                  title="Fondos destacados"
                  summary="Una selección rápida para entender en segundos por qué cada fondo puede aportar valor."
                  bleedContent
                  contentClassName="pt-md"
                >
                  {featuredState === 'loading' ? (
                    <FeaturedFundsCarousel loading />
                  ) : featuredState === 'error' ? (
                    <ReloadState
                      title="Los destacados no han cargado"
                      message="Tira hacia abajo para actualizar o reintenta. Los datos educativos volverán en cuanto la API responda."
                      onAction={() => {
                        void retryFeatured();
                      }}
                    />
                  ) : featuredState === 'empty' ? (
                    <ContentEmptyState
                      title="Sin fondos destacados ahora mismo"
                      message="Cuando haya una selección editorial disponible, aparecerá aquí en formato carrusel."
                      actionLabel="Reintentar"
                      onAction={() => {
                        void retryFeatured();
                      }}
                    />
                  ) : (
                    <FeaturedFundsCarousel
                      funds={featuredFunds}
                      onFundPress={(fund) => {
                        router.push(routes.fundDetail(fund.isin));
                      }}
                    />
                  )}
                </HomeSectionCard>

                <HomeNewsSection
                  items={newsItems}
                  loadState={newsState}
                  onRetry={() => {
                    void retryNews();
                  }}
                />
              </>
            ) : null}
          </>
        ) : (
          <HomeDynamicRankingSection
            result={filteredRankingResult}
            loadState={rankingState}
            hasQuery={hasQuery}
            isFullRanking
            rankingThemes={rankingThemeOptions}
            selectedRankingTheme={effectiveRankingTheme}
            onRankingThemeChange={setSelectedRankingTheme}
            onRetry={() => {
              void retryActiveRanking();
            }}
          />
        )}

      <LegalNotice
        body="Inversora no ofrece asesoramiento financiero personalizado. La información mostrada es educativa y orientativa."
        onLearnMorePress={handleOpenLegal}
        className="mx-lg"
      />
    </TabScreenScroll>
  );
}
