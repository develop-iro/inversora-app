import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { FundDetail } from '@/core/domain/catalog';
import { FundScoreBreakdown } from '@/features/funds/components/fund-score-breakdown';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { Badge, Button, ScorePill } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';
import { BottomTabInset, Layout, MaxContentWidth, Radius, Spacing } from '@/shared/theme/theme';

export default function FundDetailScreen() {
  const router = useRouter();
  const { isin } = useLocalSearchParams<{ isin: string }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [detail, setDetail] = useState<FundDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const resolvedIsin = typeof isin === 'string' ? isin : '';
  const { isFavorite, isLoading: isFavoriteLoading, toggle } = useFavorite(resolvedIsin);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!resolvedIsin) {
        if (!cancelled) {
          setNotFound(true);
          setIsLoading(false);
        }
        return;
      }

      const result = await getFundByIsin(resolvedIsin);

      if (cancelled) {
        return;
      }

      if (!result) {
        setNotFound(true);
        setDetail(null);
      } else {
        setDetail(result);
        setNotFound(false);
      }

      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedIsin]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (notFound || !detail) {
    return (
      <View style={[styles.centered, styles.notFound, { backgroundColor: theme.background }]}>
        <ThemedText type="sectionTitle">Fondo no encontrado</ThemedText>
        <Button label="Volver al catálogo" variant="outline" onPress={() => router.back()} />
      </View>
    );
  }

  const { fund } = detail;
  const riskLabel = getRiskLabel(fund.riskLevel);
  const favoriteLabel = isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + BottomTabInset + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          style={styles.backRow}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={theme.primary} />
          <ThemedText type="linkPrimary">Catálogo</ThemedText>
        </Pressable>

        <View style={styles.header}>
          {detail.rank != null ? (
            <ThemedText type="metaLabel" themeColor="deepOcean">
              Ranking #{detail.rank}
            </ThemedText>
          ) : null}
          <ThemedText type="sectionTitle">{fund.name}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {fund.categoryLabel}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            ISIN {fund.isin}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Datos actualizados {fund.quarterTag} ({fund.periodStart} – {fund.periodEnd})
          </ThemedText>
        </View>

        <ScorePill score={detail.invesoraScore} />

        <View style={styles.badges}>
          <Badge label={fund.badge} variant="mint" />
          <Badge
            label={`Riesgo ${riskLabel.toLowerCase()}`}
            variant={getRiskBadgeVariant(fund.riskLevel)}
          />
          <Badge label={`TER ${fund.terPercent.toFixed(2)}%`} variant="soft" />
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ThemedText type="bodyBold">Resumen</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {fund.benefitSummary}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {fund.featuredReason}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="bodyBold">Desglose del Score Invesora</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Criterios objetivos usados en el MVP mock. La IA solo explica este resultado;
            no lo recalcula.
          </ThemedText>
          <FundScoreBreakdown breakdown={detail.scoredBreakdown} />
        </View>

        <Button
          label={favoriteLabel}
          variant={isFavorite ? 'secondary' : 'primary'}
          loading={isFavoriteLoading}
          fullWidth
          onPress={toggle}
          accessibilityLabel={favoriteLabel}
        />

        <LegalNotice
          title="Aviso de riesgo"
          body="Invesora no ofrece asesoramiento financiero personalizado. El rendimiento pasado no garantiza resultados futuros. Guardar en favoritos no es una recomendación de compra."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    gap: Spacing.lg,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  header: {
    gap: Spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  section: {
    gap: Spacing.sm,
  },
});
