import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { HomeRankingRow } from '@/features/onboarding/components/home-ranking-row';
import { HomeSearchAnswerCard } from '@/features/onboarding/components/home-search-answer-card';
import type { HomeSearchResult } from '@/features/onboarding/services/resolve-home-search';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { Layout, Radius, Spacing } from '@/shared/theme/theme';

export type HomeDynamicRankingSectionProps = {
  result: HomeSearchResult | null;
  isLoading: boolean;
  hasQuery: boolean;
};

export function HomeDynamicRankingSection({
  result,
  isLoading,
  hasQuery,
}: HomeDynamicRankingSectionProps) {
  const router = useRouter();
  const theme = useTheme();

  const sectionTitle =
    result?.kind === 'fund-match'
      ? 'Coincidencias en el ranking'
      : result?.kind === 'answer'
        ? 'Ranking relacionado'
        : 'Ranking Inversora';

  const highlightLabel =
    result?.kind === 'fund-match' ? 'Mejor coincidencia' : 'Top fondo';

  return (
    <View style={styles.section}>
      {result?.kind === 'answer' ? (
        <HomeSearchAnswerCard query={result.query} answer={result.answer} />
      ) : null}

      <ThemedText type="sectionTitle">{sectionTitle}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.subtitle}>
        {result?.subtitle ??
          'Descubre los fondos mejor puntuados según el Score Inversora.'}
      </ThemedText>

      {isLoading && hasQuery ? (
        <ActivityIndicator style={styles.loader} color={theme.primary} />
      ) : null}

      {!isLoading && result && result.funds.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText type="bodyBold">Sin coincidencias en el ranking</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Prueba con el nombre completo, el ISIN o formula una pregunta educativa.
          </ThemedText>
        </View>
      ) : null}

      {result && result.funds.length > 0 ? (
        <View style={styles.list}>
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
        style={({ pressed }) => [
          styles.cta,
          { borderColor: theme.border },
          pressed && styles.ctaPressed,
        ]}
      >
        <ThemedText type="linkPrimary" style={styles.ctaLabel}>
          Ver ranking completo
        </ThemedText>
        <MaterialCommunityIcons name="arrow-right" size={16} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.md,
  },
  subtitle: {
    lineHeight: 20,
    maxWidth: 620,
  },
  loader: {
    marginVertical: Spacing.md,
  },
  empty: {
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  list: {
    gap: Spacing.sm,
    paddingTop: Spacing.half,
  },
  cta: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
    minHeight: 44,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaLabel: {
    lineHeight: 20,
  },
});
