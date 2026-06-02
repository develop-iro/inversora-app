import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { FundDetail } from '@/core/domain/catalog';
import type { FundPerformanceTimeframe } from '@/core/domain/fund-market';
import { SCORING_CRITERIA_VERSION } from '@/core/scoring/criteria';
import { FavoriteToggleButton } from '@/features/funds/components/favorite-toggle-button';
import { FundMetricsGrid } from '@/features/funds/components/fund-metrics-grid';
import { FundPerformanceChart } from '@/features/funds/components/fund-performance-chart';
import { FundScoreBreakdown } from '@/features/funds/components/fund-score-breakdown';
import { TimeframeSegmentedControl } from '@/features/funds/components/timeframe-segmented-control';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';
import {
  buildPerformanceA11yLabel,
  formatPerformanceChange,
  getPerformanceChangePercent,
  getPerformancePeriodLabel,
} from '@/features/funds/utils/fund-performance';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { Button, InfoHint } from '@/shared/components/ui';
import { routes } from '@/shared/navigation/routes';
import { useTheme } from '@/shared/hooks/use-theme';
import { getDiversificationLabel } from '@/shared/utils/fund-diversification';
import { getEfficiencyLabel } from '@/shared/utils/fund-efficiency';
import { getRiskLabel } from '@/shared/utils/fund-risk';
import { Layout, MaxContentWidth, Radius, Spacing } from '@/shared/theme/theme';

const DETAIL_HEADER_HEIGHT = 60;

type FundDetailScreenChromeProps = {
  children: ReactNode;
  bodyStyle?: StyleProp<ViewStyle>;
};

function FundDetailScreenChrome({ children, bodyStyle }: FundDetailScreenChromeProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View
        style={[
          styles.screenHeader,
          {
            backgroundColor: theme.surface,
            borderBottomColor: 'rgba(11, 46, 54, 0.06)',
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          style={styles.navButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.deepOcean} />
        </Pressable>
        <ThemedText type="navTitle" style={styles.navTitle}>
          Detalle del fondo
        </ThemedText>
        <View style={styles.navSpacer} />
      </View>
      <View style={[styles.body, bodyStyle]}>{children}</View>
    </View>
  );
}

export default function FundDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isin } = useLocalSearchParams<{ isin: string }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  useLayoutEffect(() => {
    const tabNavigation = navigation.getParent();
    if (!tabNavigation) {
      return;
    }

    tabNavigation.setOptions({ headerShown: false });

    return () => {
      tabNavigation.setOptions({ headerShown: true });
    };
  }, [navigation]);
  const [detail, setDetail] = useState<FundDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [timeframe, setTimeframe] = useState<FundPerformanceTimeframe>('1d');

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

  const performanceSeries = detail?.market.performanceByTimeframe[timeframe];
  const performanceChange = performanceSeries
    ? getPerformanceChangePercent(performanceSeries)
    : 0;
  const performanceTrendUp = performanceChange >= 0;

  const chartA11yLabel = useMemo(() => {
    if (!detail || !performanceSeries) {
      return 'Gráfico de evolución no disponible';
    }
    return buildPerformanceA11yLabel(detail.fund.name, performanceSeries);
  }, [detail, performanceSeries]);

  const keyMetrics = useMemo(() => {
    if (!detail) {
      return [];
    }

    const { fund, inversoraScore, market } = detail;
    const stabilityHint =
      market.stabilityChangePercent != null
        ? `${market.stabilityChangePercent > 0 ? '+' : ''}${market.stabilityChangePercent.toFixed(2)}%`
        : undefined;

    return [
      {
        id: 'risk',
        label: 'Riesgo orientativo',
        value: getRiskLabel(fund.riskLevel),
      },
      {
        id: 'efficiency',
        label: 'Índice de eficiencia',
        value: (inversoraScore / 10).toFixed(1),
      },
      {
        id: 'fee',
        label: 'Comisión anual',
        value: `${fund.terPercent.toFixed(2)}%`,
      },
      {
        id: 'diversification',
        label: 'Diversificación',
        value: getDiversificationLabel(fund.diversification),
      },
      {
        id: 'stability',
        label: 'Estabilidad',
        value: market.stabilityLabel,
        hint: stabilityHint,
      },
      {
        id: 'score',
        label: FUND_GLOSSARY.inversoraScore.term,
        value: `${inversoraScore}/100`,
      },
    ];
  }, [detail]);

  const regionMetrics = useMemo(() => {
    if (!detail) {
      return [];
    }

    return detail.market.regions.map((region) => ({
      id: region.label,
      label: region.label,
      value: `${region.percent}%`,
    }));
  }, [detail]);

  if (isLoading) {
    return (
      <FundDetailScreenChrome bodyStyle={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </FundDetailScreenChrome>
    );
  }

  if (notFound || !detail) {
    return (
      <FundDetailScreenChrome bodyStyle={[styles.centered, styles.notFound]}>
        <ThemedText type="sectionTitle">Fondo no encontrado</ThemedText>
        <Button label="Volver al catálogo" variant="outline" onPress={() => router.back()} />
      </FundDetailScreenChrome>
    );
  }

  const { fund } = detail;
  const efficiencyLabel = getEfficiencyLabel(detail.inversoraScore);

  return (
    <FundDetailScreenChrome>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={styles.hero}>
          {detail.rank != null ? (
            <ThemedText type="metaLabel" themeColor="deepOcean">
              Ranking #{detail.rank}
            </ThemedText>
          ) : null}
          <View style={styles.titleRow}>
            <ThemedText type="hero" style={styles.fundName} numberOfLines={3}>
              {fund.name}
            </ThemedText>
            <FavoriteToggleButton
              isin={fund.isin}
              isFavorite={isFavorite}
              isLoading={isFavoriteLoading}
              onToggle={toggle}
            />
          </View>
          <ThemedText type="caption" themeColor="textSecondary">
            {fund.categoryLabel}
          </ThemedText>

          {performanceSeries ? (
            <View style={styles.performanceRow}>
              <MaterialCommunityIcons
                name={performanceTrendUp ? 'trending-up' : 'trending-down'}
                size={18}
                color={theme.primary}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
              <ThemedText type="bodyBold" style={{ color: theme.primary }}>
                {formatPerformanceChange(performanceChange)}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {getPerformancePeriodLabel(timeframe)}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <TimeframeSegmentedControl value={timeframe} onChange={setTimeframe} />

        {performanceSeries ? (
          <FundPerformanceChart
            points={performanceSeries.points}
            accessibilityLabel={chartA11yLabel}
          />
        ) : null}

        <ThemedText type="caption" themeColor="textSecondary">
          {performanceSeries?.sourceLabel}. Actualizado{' '}
          {performanceSeries?.asOf.slice(0, 10) ?? fund.periodEnd}. El rendimiento pasado no
          garantiza resultados futuros.
        </ThemedText>

        <FundMetricsGrid title="Métricas clave" metrics={keyMetrics} />

        <FundMetricsGrid title="Región y reparto" metrics={regionMetrics} />

        <View style={styles.actionsRow}>
          <Button
            label="Pregúntale a Sora"
            variant="primary"
            style={styles.actionButton}
            accessibilityLabel="Pregúntale a Sora, asistente educativo"
            accessibilityHint="Abre la guía educativa en la pantalla principal"
            onPress={() => router.push(routes.home)}
          />
          <Button
            label="Comparar"
            variant="primary"
            style={[styles.actionButton, { backgroundColor: theme.deepOcean }]}
            accessibilityLabel={`Comparar ${fund.name} con otros fondos`}
            onPress={() => router.push(routes.compare)}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: showTechnicalDetails }}
          accessibilityLabel="Mostrar o ocultar detalles técnicos"
          onPress={() => setShowTechnicalDetails((current) => !current)}
          style={[styles.expandRow, { borderColor: theme.border, backgroundColor: theme.surface }]}
        >
          <ThemedText type="bodyBold">
            {showTechnicalDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
          </ThemedText>
          <MaterialCommunityIcons
            name={showTechnicalDetails ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>

        {showTechnicalDetails ? (
          <View
            style={[
              styles.technicalCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.technicalBlock}>
              <InfoHint
                surface="detail"
                term={FUND_GLOSSARY.isin.term}
                explanation={FUND_GLOSSARY.isin.explanation}
              />
              <ThemedText type="caption" themeColor="textSecondary">
                {fund.isin}
              </ThemedText>
            </View>
            <ThemedText type="caption" themeColor="textSecondary">
              Etiqueta de eficiencia: {efficiencyLabel}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Datos de scoring {fund.quarterTag} ({fund.periodStart} – {fund.periodEnd})
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {fund.featuredReason}
            </ThemedText>
            <ThemedText type="metaLabel" themeColor="textSecondary">
              Modelo: {SCORING_CRITERIA_VERSION}
            </ThemedText>
            <ThemedText type="bodyBold">Desglose del Score Inversora</ThemedText>
            <FundScoreBreakdown breakdown={detail.scoredBreakdown} />
          </View>
        ) : null}

        <LegalNotice
          title="Aviso legal"
          body="Información educativa. Inversora no ofrece asesoramiento financiero personalizado. Los gráficos son series ilustrativas del MVP y no sustituyen la ficha oficial del gestor."
        />
        </View>
      </ScrollView>
    </FundDetailScreenChrome>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DETAIL_HEADER_HEIGHT,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    alignItems: 'center',
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
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.sm,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
  },
  navSpacer: {
    width: 44,
  },
  hero: {
    gap: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  fundName: {
    flex: 1,
    minWidth: 0,
    letterSpacing: -0.4,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  technicalCard: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  technicalBlock: {
    gap: Spacing.xs,
  },
});
