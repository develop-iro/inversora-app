import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RiskLevel } from "@/features/funds/models/fund";
import { FEATURED_FUNDS_MOCK } from "@/features/funds/mocks/featured-funds-mock";
import { FeaturedFundsCarousel } from "@/features/onboarding/components/featured-funds-carousel";
import { HomeHero } from "@/features/onboarding/components/home-hero";
import {
  FLOATING_TAB_BAR_BOTTOM_GAP,
  FLOATING_TAB_BAR_CONTENT_GAP,
  FLOATING_TAB_BAR_HEIGHT,
} from "@/shared/components/navigation/floating-tab-bar";
import { ThemedText } from "@/shared/components/themed-text";
import { Badge, SearchField } from "@/shared/components/ui";
import { useMobileLayout } from "@/shared/hooks/use-mobile-layout";
import { useTheme } from "@/shared/hooks/use-theme";
import { Layout, Radius, Spacing } from "@/shared/theme/theme";

type RankingFund = {
  rank: number;
  name: string;
  category: string;
  isin: string;
  score: number;
  risk: RiskLevel;
  annualFee: number;
};

const RANKING_FUNDS: RankingFund[] = [
  {
    rank: 1,
    name: "MSCI World Index Core",
    category: "Renta Variable Global",
    isin: "IE00B4L5Y983",
    score: 86,
    risk: "medium",
    annualFee: 0.12,
  },
  {
    rank: 2,
    name: "S&P 500 Acc",
    category: "Renta Variable USA",
    isin: "IE00B5BMR087",
    score: 84,
    risk: "medium",
    annualFee: 0.07,
  },
  {
    rank: 3,
    name: "Europe Quality ESG",
    category: "Renta Variable Europa",
    isin: "IE00B1YZSC51",
    score: 81,
    risk: "medium",
    annualFee: 0.18,
  },
  {
    rank: 4,
    name: "Global Balanced Index",
    category: "Mixto Moderado",
    isin: "ES0123456789",
    score: 79,
    risk: "low",
    annualFee: 0.21,
  },
  {
    rank: 5,
    name: "Global Bond Index",
    category: "Renta Fija Global",
    isin: "IE00B3F81R35",
    score: 76,
    risk: "low",
    annualFee: 0.1,
  },
];

const SEARCH_SUGGESTIONS = [
  "¿Qué quieres conseguir?",
  "Quiero invertir a largo plazo",
  "Ayúdame a comparar fondos tranquilos",
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();

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
      >
        <HomeHero
          onInvestPress={() => {
            router.push("/explore");
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
            onFundPress={() => {
              router.push("/funds");
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
                containerStyle={styles.searchFieldInner}
                placeholder="¿Qué quieres conseguir?"
                suggestions={[...SEARCH_SUGGESTIONS]}
              />
            </View>
          </View>

          <View style={styles.rankingSection}>
            <ThemedText type="sectionTitle">Ranking Invesora</ThemedText>
            <ThemedText
              type="caption"
              themeColor="textSecondary"
              style={styles.rankingSubtitle}
            >
              Descubre los fondos mejor puntuados según el Score Invesora.
            </ThemedText>

            <View style={styles.rankingList}>
              {RANKING_FUNDS.slice(0, 3).map((fund) => {
                const isTopRank = fund.rank === 1;
                const riskLabel = getRiskLabel(fund.risk);

                return (
                  <Pressable
                    key={fund.rank}
                    accessibilityRole="button"
                    accessibilityLabel={buildRankingA11yLabel(fund)}
                    accessibilityHint="Abre la ficha resumida del fondo"
                    onPress={() => {
                      router.push("/funds");
                    }}
                    style={({ pressed }) => [
                      styles.rankingRow,
                      {
                        backgroundColor: isTopRank
                          ? theme.backgroundSoft
                          : theme.surface,
                        borderColor: isTopRank
                          ? "rgba(0, 191, 166, 0.35)"
                          : theme.border,
                      },
                      pressed && styles.rankingRowPressed,
                    ]}
                  >
                    <View style={styles.rankingMainContent}>
                      <View style={styles.rankingMainRow}>
                        <View style={styles.rankAndInfoBlock}>
                          <View
                            style={[
                              styles.rankIndicator,
                              isTopRank
                                ? {
                                    backgroundColor: "rgba(19, 78, 94, 0.92)",
                                    borderColor: "rgba(0, 191, 166, 0.22)",
                                  }
                                : {
                                    backgroundColor: theme.surfaceMuted,
                                    borderColor: theme.border,
                                  },
                            ]}
                          >
                            <ThemedText
                              type={isTopRank ? "chip" : "metaLabel"}
                              style={{
                                color: isTopRank
                                  ? theme.textOnDark
                                  : theme.textSecondary,
                                letterSpacing: isTopRank ? -0.3 : 0.88,
                              }}
                            >
                              #{fund.rank}
                            </ThemedText>
                          </View>

                          <View style={styles.rankingTextBlock}>
                            {isTopRank ? (
                              <View
                                style={[
                                  styles.topFundBadge,
                                  { backgroundColor: theme.accentMint },
                                ]}
                              >
                                <ThemedText
                                  type="caption"
                                  style={styles.topFundBadgeLabel}
                                >
                                  Top fondo
                                </ThemedText>
                              </View>
                            ) : null}

                            <ThemedText type="bodyBold" numberOfLines={1}>
                              {fund.name}
                            </ThemedText>
                            <ThemedText
                              type="caption"
                              themeColor="textSecondary"
                              numberOfLines={1}
                            >
                              {fund.category}
                            </ThemedText>
                            <ThemedText
                              type="caption"
                              themeColor="textSecondary"
                              numberOfLines={1}
                              style={styles.isinText}
                            >
                              ISIN {fund.isin}
                            </ThemedText>
                          </View>
                        </View>

                        <View style={styles.scoreBlock}>
                          <ThemedText type="metaLabel" themeColor="textSecondary">
                            Score Invesora
                          </ThemedText>
                          <ThemedText type="chip" style={styles.scoreValue}>
                            {fund.score}/100
                          </ThemedText>
                        </View>
                      </View>

                      <View style={styles.rankingMetaRow}>
                        <View style={styles.rankingMetaLeft}>
                          <Badge
                            label={`Riesgo ${riskLabel.toLowerCase()}`}
                            variant={getRiskBadgeVariant(fund.risk)}
                          />
                          <ThemedText
                            type="caption"
                            themeColor="textSecondary"
                            style={styles.annualFeeText}
                          >
                            Comisión anual {fund.annualFee.toFixed(2)}%
                          </ThemedText>
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={18}
                          color={theme.textSecondary}
                        />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver ranking completo"
              accessibilityHint="Navega al listado completo de fondos"
              onPress={() => {
                router.push("/funds");
              }}
              style={({ pressed }) => [
                styles.rankingCta,
                { borderColor: theme.border },
                pressed && styles.rankingCtaPressed,
              ]}
            >
              <ThemedText type="linkPrimary" style={styles.rankingCtaLabel}>
                Ver ranking completo
              </ThemedText>
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color={theme.primary}
              />
            </Pressable>
          </View>

          <View style={styles.soraSection}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="No sabes por dónde empezar, abrir guía de Sora"
              accessibilityHint="Inicia una guía breve antes de comparar fondos"
              onPress={() => {
                router.push("/explore");
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
              accessibilityLabel="Información educativa. Invesora no ofrece asesoramiento financiero personalizado. La información mostrada es educativa y orientativa."
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
                Invesora no ofrece asesoramiento financiero personalizado. La
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
  searchFieldInner: {
    minHeight: 60,
  },
  rankingSection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.md,
  },
  rankingSubtitle: {
    lineHeight: 20,
    maxWidth: 620,
  },
  rankingList: {
    gap: Spacing.sm,
    paddingTop: Spacing.half,
  },
  rankingRow: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: 96,
  },
  rankingRowPressed: {
    opacity: 0.92,
  },
  rankingMainContent: {
    gap: Spacing.xs,
  },
  rankingMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  rankAndInfoBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  rankIndicator: {
    minWidth: 37,
    minHeight: 37,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
    marginTop: 2,
  },
  rankingTextBlock: {
    flex: 1,
    gap: 3,
  },
  topFundBadge: {
    alignSelf: "flex-start",
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: 1,
  },
  topFundBadgeLabel: {
    fontSize: 11,
    lineHeight: 15,
  },
  isinText: {
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.62,
  },
  scoreBlock: {
    alignItems: "flex-end",
    gap: 2,
    minWidth: 88,
  },
  scoreValue: {
    letterSpacing: -0.3,
    fontSize: 18,
    lineHeight: 24,
  },
  rankingMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  rankingMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.sm,
    flex: 1,
  },
  annualFeeText: {
    fontSize: 12,
    lineHeight: 16,
  },
  rankingCta: {
    marginTop: Spacing.xs,
    alignSelf: "flex-start",
    minHeight: 44,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  rankingCtaPressed: {
    opacity: 0.85,
  },
  rankingCtaLabel: {
    lineHeight: 20,
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

function getRiskLabel(risk: RiskLevel) {
  switch (risk) {
    case "low":
      return "Bajo";
    case "high":
      return "Alto";
    case "medium":
    default:
      return "Medio";
  }
}

function getRiskBadgeVariant(risk: RiskLevel) {
  switch (risk) {
    case "low":
      return "mint" as const;
    case "high":
      return "danger" as const;
    case "medium":
    default:
      return "warning" as const;
  }
}

function buildRankingA11yLabel(fund: RankingFund) {
  const riskLabel = getRiskLabel(fund.risk).toLowerCase();
  return `Ranking ${fund.rank}, ${fund.name}, Score Invesora ${fund.score} sobre 100, riesgo ${riskLabel}, comisión anual ${fund.annualFee.toFixed(2)} por ciento.`;
}
