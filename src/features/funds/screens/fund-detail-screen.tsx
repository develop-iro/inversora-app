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
import { FundApiErrorState } from '@/features/funds/components/fund-api-error-state';
import { FundDataQualityBanner } from '@/features/funds/components/detail/fund-data-quality-banner';
import { FundDetailDistributorsSection } from '@/features/funds/components/detail/fund-detail-distributors-section';
import { FundDetailExposureSection } from '@/features/funds/components/detail/fund-detail-exposure-section';
import { FundDetailInformationSection } from '@/features/funds/components/detail/fund-detail-information-section';
import { FundDetailRatiosSection } from '@/features/funds/components/detail/fund-detail-ratios-section';
import { FundDetailReturnsSection } from '@/features/funds/components/detail/fund-detail-returns-section';
import { FundDetailSectionEmptyState } from '@/features/funds/components/detail/fund-detail-section-empty-state';
import { FundDetailHeroIsin } from '@/features/funds/components/detail/fund-detail-hero-isin';
import { FundDetailScoreSection } from '@/features/funds/components/detail/fund-detail-score-section';
import { FundDetailSheetFreshness } from '@/features/funds/components/detail/fund-detail-sheet-freshness';
import { FavoriteToggleButton } from '@/features/funds/components/favorite-toggle-button';
import { FundMetricsGrid } from '@/features/funds/components/fund-metrics-grid';
import { FundPerformanceChart } from '@/features/funds/components/fund-performance-chart';
import { TimeframeSegmentedControl } from '@/features/funds/components/timeframe-segmented-control';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';
import { getRegionMetricsForGrid, shouldShowRegionSummary } from '@/features/funds/utils/fund-detail-presentation';
import { resolveFundApiErrorMessage } from '@/features/funds/utils/resolve-fund-api-error-message';
import {
  buildPerformanceA11yLabel,
  formatPerformanceChange,
  getIllustrativeNavBase,
  getPerformanceChangePercent,
  getPerformancePeriodLabel,
} from '@/features/funds/utils/fund-performance';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui';
import { routes } from '@/shared/navigation/routes';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { getDiversificationLabel } from '@/shared/utils/fund-diversification';
import { getRiskLabel } from '@/shared/utils/fund-risk';
import { Layout, Spacing } from '@/shared/theme/theme';

const DETAIL_HEADER_HEIGHT = 60;

type FundDetailScreenChromeProps = {
  children: ReactNode;
  bodyStyle?: StyleProp<ViewStyle>;
};

function FundDetailScreenChrome({ children, bodyStyle }: FundDetailScreenChromeProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();

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
        <View
          style={[
            styles.screenHeaderInner,
            {
              width: contentWidth,
              maxWidth: contentWidth,
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
  const { contentWidth } = useMobileLayout();

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [timeframe, setTimeframe] = useState<FundPerformanceTimeframe>('3y');

  const resolvedIsin = typeof isin === 'string' ? isin : '';
  const { isFavorite, isLoading: isFavoriteLoading, toggle } = useFavorite(resolvedIsin);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!resolvedIsin) {
        if (!cancelled) {
          setNotFound(true);
          setLoadError(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      setNotFound(false);

      try {
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
      } catch (error) {
        if (!cancelled) {
          setDetail(null);
          setNotFound(false);
          setLoadError(resolveFundApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedIsin, reloadToken]);

  const handleRetryLoad = () => {
    setReloadToken((current) => current + 1);
  };

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

    const { fund, market } = detail;
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
    ];
  }, [detail]);

  const regionMetrics = useMemo(() => {
    if (!detail || !shouldShowRegionSummary(detail)) {
      return [];
    }

    return getRegionMetricsForGrid(detail);
  }, [detail]);

  if (isLoading) {
    return (
      <FundDetailScreenChrome bodyStyle={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </FundDetailScreenChrome>
    );
  }

  if (loadError) {
    return (
      <FundDetailScreenChrome bodyStyle={[styles.centered, styles.notFound]}>
        <FundApiErrorState
          title="No se pudo cargar la ficha"
          message={loadError}
          onRetry={handleRetryLoad}
        />
        <Button label="Volver al catálogo" variant="outline" onPress={() => router.back()} />
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
        <View
          style={[
            styles.inner,
            {
              width: contentWidth,
              maxWidth: contentWidth,
            },
          ]}
        >
          <View style={styles.hero}>
          {detail.rank != null ? (
            <ThemedText type="metaLabel" themeColor="deepOcean">
              Ranking #{detail.rank}
            </ThemedText>
          ) : null}
          <View style={styles.heroMain}>
            <View style={styles.titleBlock}>
              <ThemedText type="cardTitle" style={styles.fundName} numberOfLines={3}>
                {fund.name}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {fund.categoryLabel}
              </ThemedText>
              <FundDetailHeroIsin isin={fund.isin} />
            </View>
            <View style={styles.favoriteSlot}>
              <FavoriteToggleButton
                isin={fund.isin}
                isFavorite={isFavorite}
                isLoading={isFavoriteLoading}
                onToggle={toggle}
              />
            </View>
          </View>

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

        <FundDetailSheetFreshness asOf={detail.profile.asOf} />

        <FundDetailScoreSection
          score={detail.inversoraScore}
          breakdown={detail.scoredBreakdown}
          fund={fund}
        />

        <FundDataQualityBanner status={detail.scoringStatus} />

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

        <TimeframeSegmentedControl value={timeframe} onChange={setTimeframe} />

        {performanceSeries && performanceSeries.points.length > 1 ? (
          <FundPerformanceChart
            points={performanceSeries.points}
            navBase={getIllustrativeNavBase(fund.isin)}
            accessibilityLabel={chartA11yLabel}
          />
        ) : (
          <FundDetailSectionEmptyState message="Todavía no hay suficiente histórico para mostrar la evolución en este periodo." />
        )}

        <ThemedText type="caption" themeColor="textSecondary">
          {performanceSeries?.sourceLabel}. Valores liquidativos ilustrativos en EUR. El rendimiento
          pasado no garantiza resultados futuros.
        </ThemedText>

        <FundDetailInformationSection profile={detail.profile} />

        <FundDetailReturnsSection profile={detail.profile} fundName={fund.name} />

        <FundMetricsGrid title="Métricas clave" metrics={keyMetrics} />

        {regionMetrics.length > 0 ? (
          <FundMetricsGrid title="Región y reparto (resumen)" metrics={regionMetrics} />
        ) : null}

        <FundDetailRatiosSection profile={detail.profile} fundName={fund.name} />

        <FundDetailExposureSection profile={detail.profile} />

        <FundDetailDistributorsSection profile={detail.profile} />

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
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  screenHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DETAIL_HEADER_HEIGHT,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
  },
  inner: {
    alignSelf: 'center',
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
  heroMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
  },
  favoriteSlot: {
    flexShrink: 0,
    marginTop: 2,
  },
  fundName: {
    letterSpacing: -0.36,
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
});
