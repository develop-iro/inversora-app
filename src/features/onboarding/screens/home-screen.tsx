import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeaturedFundsCarousel } from '@/features/onboarding/components/featured-funds-carousel';
import { HomeDynamicRankingSection } from '@/features/onboarding/components/home-dynamic-ranking-section';
import { HomeHeroCarousel } from '@/features/onboarding/components/home-hero-carousel';
import { HomeNewsSection } from '@/features/onboarding/components/home-news-section';
import { HomeScrollSection } from '@/features/onboarding/components/home-scroll-section';
import { HomeSectionHeader } from '@/features/onboarding/components/home-section-header';
import { HomeStarterCard } from '@/features/onboarding/components/home-starter-card';
import { HomeFeaturedFundsSkeleton } from '@/features/onboarding/components/skeletons/home-featured-funds-skeleton';
import type { HomeHeroSlideAction } from '@/features/onboarding/constants/home-hero-slides';
import { useHomeScreenData } from '@/features/onboarding/hooks/use-home-screen-data';
import {
  FLOATING_TAB_BAR_BOTTOM_GAP,
  FLOATING_TAB_BAR_CONTENT_GAP,
  FLOATING_TAB_BAR_HEIGHT,
} from '@/shared/components/navigation/floating-tab-bar';
import { ThemedText } from '@/shared/components/themed-text';
import { ContentEmptyState, SearchField } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { Layout, Spacing } from '@/shared/theme/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();
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

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            width: contentWidth,
            maxWidth: contentWidth,
            paddingBottom:
              FLOATING_TAB_BAR_HEIGHT +
              FLOATING_TAB_BAR_BOTTOM_GAP +
              FLOATING_TAB_BAR_CONTENT_GAP +
              insets.bottom,
          },
        ]}
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

        <HomeScrollSection showDivider={false}>
          <View style={styles.searchSection}>
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
          </View>
        </HomeScrollSection>

        {!hasQuery ? (
          <HomeScrollSection>
            <View style={styles.blockHeader}>
              <HomeSectionHeader
                title="Fondos destacados"
                summary="Una selección rápida para entender en segundos por qué cada fondo puede aportar valor."
              />
            </View>

            {featuredState === 'loading' ? (
              <HomeFeaturedFundsSkeleton />
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
                style={styles.emptyCard}
              />
            ) : (
              <FeaturedFundsCarousel
                funds={featuredFunds}
                onFundPress={(fund) => {
                  router.push(routes.fundDetail(fund.isin));
                }}
              />
            )}
          </HomeScrollSection>
        ) : null}

        <HomeScrollSection>
          <HomeDynamicRankingSection
            result={activeRanking}
            loadState={rankingState}
            hasQuery={hasQuery}
            onRetry={() => {
              void retryActiveRanking();
            }}
          />
        </HomeScrollSection>

        {!hasQuery ? (
          <>
            <HomeScrollSection>
              <View style={styles.blockHeader}>
                <HomeSectionHeader title="Para empezar" />
              </View>
              <View style={styles.starterRow}>
                <HomeStarterCard
                  title="Conceptos básicos"
                  iconName="book-open-page-variant-outline"
                  accessibilityLabel="Conceptos básicos, abrir guía educativa"
                  accessibilityHint="Inicia el cuestionario para conocer tu perfil educativo"
                  onPress={handleLearnPress}
                />
                <HomeStarterCard
                  title="Ver ranking educativo"
                  iconName="chart-line"
                  accessibilityLabel="Ver ranking educativo, abrir catálogo de fondos"
                  accessibilityHint="Explora el ranking de fondos indexados"
                  onPress={() => {
                    router.push(routes.fundsCatalog);
                  }}
                />
              </View>
            </HomeScrollSection>

            <HomeScrollSection>
              <HomeNewsSection
                items={newsItems}
                loadState={newsState}
                onRetry={() => {
                  void retryNews();
                }}
              />
            </HomeScrollSection>
          </>
        ) : null}

        <View style={styles.scrollHint} accessibilityElementsHidden importantForAccessibility="no">
          <MaterialCommunityIcons name="gesture-swipe-vertical" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary">
            Desliza para explorar
          </ThemedText>
        </View>

        <View style={styles.disclaimerSection}>
          <MaterialCommunityIcons
            name="information-outline"
            size={14}
            color={theme.textSecondary}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
          <ThemedText
            type="caption"
            themeColor="textSecondary"
            accessibilityRole="text"
            style={styles.disclaimerText}
          >
            Inversora no ofrece asesoramiento financiero personalizado. La
            información mostrada es educativa y orientativa.
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignSelf: 'center',
    gap: Spacing.md,
    paddingTop: Spacing.xs,
  },
  searchSection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  blockHeader: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  starterRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  emptyCard: {
    marginHorizontal: Layout.screenPaddingHorizontal,
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
    opacity: 0.7,
  },
  disclaimerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.xs,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});
