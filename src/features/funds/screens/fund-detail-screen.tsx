import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { trackEvent, trackPerfMark } from '@/core/analytics/track-event';
import { parseOptionalFundIsinParam } from '@/core/domain/fund-isin';
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
import { FundDetailLiveQuote } from '@/features/funds/components/detail/fund-detail-live-quote';
import { FundDetailScoreSection } from '@/features/funds/components/detail/fund-detail-score-section';
import { FundDetailSheetFreshness } from '@/features/funds/components/detail/fund-detail-sheet-freshness';
import { useFundLiveMarketSnapshot } from '@/features/funds/hooks/use-fund-live-market-snapshot';
import { FavoriteToggleButton } from '@/features/funds/components/favorite-toggle-button';
import { FundMetricsGrid } from '@/features/funds/components/fund-metrics-grid';
import { FundPerformanceChart } from '@/features/funds/components/fund-performance-chart';
import { TabChipFund } from '@/features/funds/components/tabs/tab-chip-fund';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';
import {
  getRegionMetricsForGrid,
  hasPerformanceHistory,
  hasSheetFreshness,
  isMissingProfileValue,
  shouldShowRegionSummary,
} from '@/features/funds/utils/fund-detail-presentation';
import { resolveFundApiErrorMessage } from '@/features/funds/utils/resolve-fund-api-error-message';
import {
  buildPerformanceA11yLabel,
  formatPerformanceChange,
  getIllustrativeNavBase,
  getPerformanceChangePercent,
  getPerformancePeriodLabel,
} from '@/features/funds/utils/fund-performance';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ScreenShell } from '@/shared/components/layout';
import { Header } from '@/shared/components/headers';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Button, Spinner } from '@/shared/components/ui';
import { routes } from '@/shared/navigation/routes';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { getDiversificationLabel } from '@/shared/utils/fund-diversification';
import { getRiskLabel } from '@/shared/utils/fund-risk';
import { Layout, Spacing } from '@/shared/theme/theme';

type FundDetailShellProps = {
  children: ReactNode;
  bodyStyle?: StyleProp<ViewStyle>;
  onSoraPress?: () => void;
};

function FundDetailShell({ children, bodyStyle, onSoraPress }: FundDetailShellProps) {
  const router = useRouter();

  return (
    <ScreenShell
      header={
        <Header
          title="Detalle del fondo"
          leadingActions={['back']}
          trailingActions={onSoraPress ? ['sora'] : []}
          onAction={{
            back: () => router.back(),
            ...(onSoraPress ? { sora: onSoraPress } : {}),
          }}
        />
      }
      body={<View style={[styles.body, bodyStyle]}>{children}</View>}
    />
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
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);
  const loadStartedAtRef = useRef(0);

  const resolvedIsin = parseOptionalFundIsinParam(isin) ?? '';

  useEffect(() => {
    loadStartedAtRef.current = performance.now();

    if (resolvedIsin) {
      void trackEvent('screen_view', 'fund_detail', { isin: resolvedIsin });
    }
  }, [resolvedIsin]);
  const { isFavorite, isLoading: isFavoriteLoading, toggle } = useFavorite(resolvedIsin);
  const {
    snapshot: liveMarketSnapshot,
    isLoading: isLiveMarketLoading,
  } = useFundLiveMarketSnapshot(resolvedIsin);

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
      loadStartedAtRef.current = performance.now();

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
          trackPerfMark('fund_detail', performance.now() - loadStartedAtRef.current);
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
    ].filter((metric) => !isMissingProfileValue(metric.value));
  }, [detail]);

  const regionMetrics = useMemo(() => {
    if (!detail || !shouldShowRegionSummary(detail)) {
      return [];
    }

    return getRegionMetricsForGrid(detail);
  }, [detail]);

  const handleOpenSora = () => {
    setSoraSession((current) => current + 1);
    setIsSoraVisible(true);
  };

  if (isLoading) {
    return (
      <FundDetailShell bodyStyle={styles.centered}>
        <Spinner fullscreen size="lg" accessibilityLabel="Cargando ficha del fondo" />
      </FundDetailShell>
    );
  }

  if (loadError) {
    return (
      <FundDetailShell bodyStyle={[styles.centered, styles.notFound]}>
        <FundApiErrorState
          title="No se pudo cargar la ficha"
          message={loadError}
          onRetry={handleRetryLoad}
        />
        <Button label="Volver al catálogo" variant="outline" onPress={() => router.back()} />
      </FundDetailShell>
    );
  }

  if (notFound || !detail) {
    return (
      <FundDetailShell bodyStyle={[styles.centered, styles.notFound]}>
        <TextHeading variant="section">Fondo no encontrado</TextHeading>
        <Button label="Volver al catálogo" variant="outline" onPress={() => router.back()} />
      </FundDetailShell>
    );
  }

  const { fund } = detail;
  const showPerformanceHistory = hasPerformanceHistory(detail);

  return (
    <FundDetailShell onSoraPress={handleOpenSora}>
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
              <TextLabel variant="meta" themeColor="deepOcean">
                Ranking #{detail.rank}
              </TextLabel>
            ) : null}
            <View style={styles.heroMain}>
              <View style={styles.titleBlock}>
                <TextHeading variant="card" style={styles.fundName} numberOfLines={3}>
                  {fund.name}
                </TextHeading>
                <TextParagraph variant="secondary" themeColor="textSecondary">
                  {fund.categoryLabel}
                </TextParagraph>
                <FundDetailHeroIsin isin={fund.isin} />
                <FundDetailLiveQuote
                  snapshot={liveMarketSnapshot}
                  isLoading={isLiveMarketLoading}
                />
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

            {performanceSeries && performanceSeries.points.length >= 2 ? (
              <View style={styles.performanceRow}>
                <MaterialCommunityIcons
                  name={performanceTrendUp ? 'trending-up' : 'trending-down'}
                  size={18}
                  color={theme.primary}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                />
                <TextParagraph variant="emphasis" style={{ color: theme.primary }}>
                  {formatPerformanceChange(performanceChange)}
                </TextParagraph>
                <TextParagraph variant="secondary" themeColor="textSecondary">
                  {getPerformancePeriodLabel(timeframe)}
                </TextParagraph>
              </View>
            ) : null}
          </View>

          {hasSheetFreshness(detail.profile.asOf) ? (
            <FundDetailSheetFreshness asOf={detail.profile.asOf} />
          ) : null}

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
              accessibilityHint="Abre el asistente educativo con contexto de este fondo"
              onPress={handleOpenSora}
            />
            <Button
              label="Comparar"
              variant="primary"
              style={[styles.actionButton, { backgroundColor: theme.deepOcean }]}
              accessibilityLabel={`Comparar ${fund.name} con otros fondos`}
              onPress={() => router.push(routes.compareWithIsins([fund.isin]))}
            />
          </View>

          <Button
            label="Simular inversión"
            variant="secondary"
            fullWidth
            accessibilityLabel={`Simular inversión con ${fund.name} en la calculadora`}
            accessibilityHint="Abre la calculadora de interés compuesto con este fondo como referencia"
            onPress={() => router.push(routes.calculatorWithFund(fund.isin))}
          />

          {showPerformanceHistory ? (
            <View style={styles.performanceSection}>
              <TabChipFund value={timeframe} onChange={setTimeframe} />

              {performanceSeries && performanceSeries.points.length > 1 ? (
                <FundPerformanceChart
                  points={performanceSeries.points}
                  navBase={getIllustrativeNavBase(fund.isin)}
                  accessibilityLabel={chartA11yLabel}
                />
              ) : (
                <FundDetailSectionEmptyState message="Todavía no hay suficiente histórico para mostrar la evolución en este periodo." />
              )}

              <TextParagraph variant="secondary" themeColor="textSecondary">
                {performanceSeries?.sourceLabel}. Valores liquidativos ilustrativos en EUR. El
                rendimiento pasado no garantiza resultados futuros.
              </TextParagraph>
            </View>
          ) : null}

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
            onLearnMorePress={() => router.push(routes.legal)}
          />
        </View>
      </ScrollView>

      <SoraChatSheet
        key={`fund-sora-${soraSession}`}
        visible={isSoraVisible}
        onClose={() => {
          setIsSoraVisible(false);
        }}
        surface="fund-detail"
        fundIsin={fund.isin}
        conversationMode
        quickPrompts={[
          '¿Qué significa este score?',
          '¿Qué es el TER?',
          '¿Por qué aparece en el ranking?',
        ]}
      />
    </FundDetailShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  inner: {
    alignSelf: 'center',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.md,
    paddingTop: Spacing.sm,
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
    marginTop: Spacing.half,
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
  performanceSection: {
    gap: Spacing.sm,
    alignSelf: 'stretch',
  },
  actionButton: {
    flex: 1,
  },
});
