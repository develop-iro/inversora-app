import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FEATURED_FUNDS_MOCK } from "@/features/funds/mocks/featured-funds-mock";
import { CATALOG_SEARCH_DEBOUNCE_MS } from "@/features/funds/utils/fund-search";
import { FeaturedFundsCarousel } from "@/features/onboarding/components/featured-funds-carousel";
import { HomeDynamicRankingSection } from "@/features/onboarding/components/home-dynamic-ranking-section";
import { HomeHero } from "@/features/onboarding/components/home-hero";
import {
  resolveHomeSearch,
  type HomeSearchResult,
} from "@/features/onboarding/services/resolve-home-search";
import {
  FLOATING_TAB_BAR_BOTTOM_GAP,
  FLOATING_TAB_BAR_CONTENT_GAP,
  FLOATING_TAB_BAR_HEIGHT,
} from "@/shared/components/navigation/floating-tab-bar";
import { ThemedText } from "@/shared/components/themed-text";
import { SearchField } from "@/shared/components/ui";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { useMobileLayout } from "@/shared/hooks/use-mobile-layout";
import { useTheme } from "@/shared/hooks/use-theme";
import { routes } from "@/shared/navigation/routes";
import { Layout, Radius, Spacing } from "@/shared/theme/theme";

const SEARCH_SUGGESTIONS = [
  "¿Qué quieres conseguir?",
  "Quiero invertir a largo plazo",
  "MSCI World",
  "Ayúdame a comparar fondos tranquilos",
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<HomeSearchResult | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(true);

  const debouncedQuery = useDebouncedValue(searchQuery, CATALOG_SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsSearchLoading(true);
      const result = await resolveHomeSearch(debouncedQuery);

      if (!cancelled) {
        setSearchResult(result);
        setIsSearchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

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
      >
        <HomeHero
          onInvestPress={() => {
            router.push(routes.fundsCatalog);
          }}
        />

        <View style={[styles.contentPanel, { backgroundColor: theme.surface }]}>
          <View style={styles.featuredHeader}>
            <ThemedText type="sectionTitle" style={styles.featuredHeaderTitle}>
              Fondos destacados
            </ThemedText>
            <ThemedText
              type="caption"
              themeColor="textSecondary"
              style={styles.featuredHeaderSummary}
            >
              Una selección rápida para entender en segundos por qué cada fondo
              puede aportar valor.
            </ThemedText>
          </View>

          <FeaturedFundsCarousel
            funds={FEATURED_FUNDS_MOCK.filter((fund) => fund.isFeatured)}
            onFundPress={(fund) => {
              router.push(routes.fundDetail(fund.isin));
            }}
          />

          <View style={styles.searchSection}>
            <View style={styles.searchBlock}>
              <ThemedText
                type="metaLabel"
                themeColor="deepOcean"
                style={styles.searchLabel}
              >
                Pregunta o busca
              </ThemedText>
              <SearchField
                accessibilityLabel="Pregunta o busca fondos, categorías u objetivos"
                placeholder="¿Qué quieres conseguir?"
                value={searchQuery}
                onChangeText={handleSearchChange}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                suggestions={[...SEARCH_SUGGESTIONS]}
              />
            </View>
          </View>

          <HomeDynamicRankingSection
            result={searchResult}
            isLoading={isSearchLoading}
            hasQuery={searchQuery.trim().length > 0}
          />

          <View style={styles.soraSection}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="No sabes por dónde empezar, abrir guía de Sora"
              accessibilityHint="Inicia una guía breve antes de comparar fondos"
              onPress={() => {
                router.push(routes.fundsCatalog);
              }}
              style={({ pressed }) => [
                styles.soraCard,
                {
                  backgroundColor: "rgba(234, 248, 246, 0.66)",
                  borderColor: "rgba(0, 191, 166, 0.16)",
                },
                pressed && styles.soraCardPressed,
              ]}
            >
              <View style={styles.soraHeader}>
                <View
                  style={[
                    styles.soraIconWrap,
                    { backgroundColor: "rgba(0, 191, 166, 0.14)" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="compass-outline"
                    size={14}
                    color={theme.deepOcean}
                  />
                </View>
                <ThemedText type="bodyBold" style={styles.soraTitle}>
                  ¿No sabes por dónde empezar?
                </ThemedText>
              </View>

              <ThemedText
                type="caption"
                themeColor="textSecondary"
                style={styles.soraBody}
              >
                Sora puede ayudarte a entender tu perfil antes de comparar fondos.
              </ThemedText>

              <View style={styles.soraCtaRow}>
                <ThemedText type="linkPrimary">Empezar guía</ThemedText>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={14}
                  color={theme.primary}
                />
              </View>
            </Pressable>
          </View>

          <View style={styles.disclaimerSection}>
            <View
              accessibilityRole="summary"
              accessibilityLabel="Información educativa. Inversora no ofrece asesoramiento financiero personalizado. La información mostrada es educativa y orientativa."
              style={[
                styles.disclaimerCard,
                {
                  backgroundColor: "rgba(234, 248, 246, 0.28)",
                  borderColor: "rgba(11, 46, 54, 0.04)",
                },
              ]}
            >
              <View style={styles.disclaimerHeader}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={14}
                  color="rgba(11, 46, 54, 0.58)"
                />
                <ThemedText
                  type="caption"
                  themeColor="textSecondary"
                  style={styles.disclaimerTitle}
                >
                  Información educativa
                </ThemedText>
              </View>
              <ThemedText
                type="caption"
                themeColor="textSecondary"
                style={styles.disclaimerBody}
              >
                Inversora no ofrece asesoramiento financiero personalizado. La
                información mostrada es educativa y orientativa.
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    alignSelf: "center",
  },
  contentPanel: {
    alignSelf: "stretch",
    paddingBottom: Spacing.xl,
  },
  featuredHeader: {
    paddingTop: Spacing["2xl"],
    paddingBottom: Spacing.sm,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.sm,
  },
  featuredHeaderTitle: {
    letterSpacing: -0.2,
  },
  featuredHeaderSummary: {
    maxWidth: 620,
    lineHeight: 22,
  },
  searchSection: {
    alignItems: "center",
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing["2xl"],
  },
  searchBlock: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
    gap: Spacing.md,
  },
  searchLabel: {
    letterSpacing: 0.96,
  },
  soraSection: {
    paddingTop: Spacing.xl + Spacing.xs,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  soraCard: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  soraCardPressed: {
    opacity: 0.88,
  },
  soraHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  soraIconWrap: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  soraTitle: {
    flex: 1,
  },
  soraBody: {
    lineHeight: 18,
  },
  soraCtaRow: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  disclaimerSection: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  disclaimerCard: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  disclaimerTitle: {
    color: "rgba(11, 46, 54, 0.68)",
    fontSize: 12,
    lineHeight: 17,
  },
  disclaimerBody: {
    fontSize: 12,
    lineHeight: 17,
  },
});
