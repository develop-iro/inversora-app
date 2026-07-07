import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  buildRankingThemeOptions,
  filterRankingByTheme,
  formatRankingThemeLabel,
} from '@/features/onboarding/utils/build-ranking-theme-options';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import {
  NAV_TAB_BAR_BOTTOM_GAP,
  NAV_TAB_BAR_CONTENT_GAP,
  NAV_TAB_BAR_HEIGHT,
} from '@/shared/components/navigation/nav-tab-bar';
import { ContentEmptyState, SearchField, TabPill } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { Spacing } from '@/shared/theme/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();
  const [activeTab, setActiveTab] = useState<HomeContentTab>('explore');
  const [selectedRankingTheme, setSelectedRankingTheme] = useState<string | 'all'>('all');
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

  const effectiveRankingTheme =
    hasQuery || activeTab !== 'ranking' ? 'all' : selectedRankingTheme;

  const rankingThemeOptions = useMemo(
    () => buildRankingThemeOptions(activeRanking?.funds ?? []),
    [activeRanking?.funds],
  );

  const filteredRankingResult = useMemo((): HomeSearchResult | null => {
    if (!activeRanking) {
      return null;
    }

    if (effectiveRankingTheme === 'all' || hasQuery) {
      return activeRanking;
    }

    const filteredFunds = filterRankingByTheme(activeRanking.funds, effectiveRankingTheme).map(
      (fund, index) => ({
        ...fund,
        displayRank: index + 1,
        isHighlighted: index === 0,
      }),
    );

    return {
      ...activeRanking,
      funds: filteredFunds,
      subtitle: `Observa el ranking de ${formatRankingThemeLabel(effectiveRankingTheme)} según el Score Inversora.`,
    };
  }, [activeRanking, effectiveRankingTheme, hasQuery]);

  const showExploreDefault = activeTab === 'explore' && !hasQuery;
  const showExploreSearchResults = activeTab === 'explore' && hasQuery && activeRanking;

  return (
    <View className="flex-1 items-center" style={{ backgroundColor: theme.background }}>
      <ScrollView
        className="w-full flex-1"
        contentContainerClassName="flex-grow gap-lg self-center pt-xs"
        contentContainerStyle={{
          width: contentWidth,
          maxWidth: contentWidth,
          paddingBottom:
            NAV_TAB_BAR_HEIGHT +
            NAV_TAB_BAR_BOTTOM_GAP +
            NAV_TAB_BAR_CONTENT_GAP +
            insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            {showExploreSearchResults && activeRanking.kind === 'answer' ? (
              <HomeSectionCard
                title="Respuesta educativa"
                summary="Contexto sobre tu consulta, sin recomendaciones personalizadas."
              >
                <HomeExploreAnswerSection result={activeRanking} />
              </HomeSectionCard>
            ) : null}

            {showExploreSearchResults && activeRanking.kind === 'fund-match' ? (
              <HomeSectionCard title="Coincidencias en el ranking">
                <HomeExploreFundMatchPrompt
                  result={activeRanking}
                  onOpenRanking={handleOpenRankingTab}
                />
              </HomeSectionCard>
            ) : null}

            {showExploreDefault ? (
              <>
                <HomeSectionCard title="Para empezar" borderless contentClassName="p-0">
                  <View style={styles.starterRow}>
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
                  ) : featuredState === 'error' || featuredState === 'empty' ? (
                    <ContentEmptyState
                      icon="star-four-points-outline"
                      title={
                        featuredState === 'error'
                          ? 'Los destacados no han cargado'
                          : 'Sin fondos destacados ahora mismo'
                      }
                      message={
                        featuredState === 'error'
                          ? 'Tira hacia abajo para actualizar o reintenta. Los datos educativos volverán en cuanto la API responda.'
                          : 'Cuando haya una selección editorial disponible, aparecerá aquí en formato carrusel.'
                      }
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  starterRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.md,
    width: '100%',
  },
});
