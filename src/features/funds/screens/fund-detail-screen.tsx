import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { trackPerfMark } from '@/core/analytics/track-event';
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
import { FundCardIcon } from '@/features/funds/components/fund-card-icon';
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
import { Button, Spinner, SlowRequestReloadState } from '@/shared/components/ui';
import { useSlowRequestNotice } from '@/shared/hooks/use-slow-request-notice';
import { routes } from '@/shared/navigation/routes';
import {
  navigateBackFromFundDetail,
  parseFundDetailReturnTo,
  type FundDetailBackNavigation,
} from '@/shared/navigation/fund-detail-navigation';
import { useNavigateToTabRoute } from '@/shared/navigation/use-navigate-to-tab-route';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { getDiversificationLabel } from '@/shared/utils/fund-diversification';
import { getRiskLabel } from '@/shared/utils/fund-risk';
import { Layout, Spacing } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

type FundDetailShellProps = {
  children: ReactNode;
  bodyClassName?: string;
  bodyStyle?: StyleProp<ViewStyle>;
  onSoraPress?: () => void;
  onBackPress: () => void;
};

function FundDetailShell({ children, bodyClassName, bodyStyle, onSoraPress, onBackPress }: FundDetailShellProps) {
  return (
    <ScreenShell
      header={
        <Header
          title="Detalle del fondo"
          leadingActions={['back']}
          trailingActions={onSoraPress ? ['sora'] : []}
          onAction={{
            back: onBackPress,
            ...(onSoraPress ? { sora: onSoraPress } : {}),
          }}
        />
      }
      body={
        <View className={cn('flex-1', bodyClassName)} style={bodyStyle}>
          {children}
        </View>
      }
    />
  );
}

export default function FundDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isin, returnTo: returnToParam } = useLocalSearchParams<{
    isin: string;
    returnTo?: string | string[];
  }>();
  const returnTo = parseFundDetailReturnTo(returnToParam);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();
  const { navigateToCompare, navigateToCalculator } = useNavigateToTabRoute();

  const handleBackPress = useCallback(() => {
    navigateBackFromFundDetail(
      navigation as unknown as FundDetailBackNavigation,
      router,
      returnTo,
    );
  }, [navigation, returnTo, router]);

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: returnTo === undefined,
    });
  }, [navigation, returnTo]);

  useEffect(() => {
    if (returnTo === undefined) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress();
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, [handleBackPress, returnTo]);

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
  const { isSlow: isDetailLoadSlow } = useSlowRequestNotice({
    isLoading,
    loadingKey: reloadToken,
  });

  useEffect(() => {
    loadStartedAtRef.current = performance.now();
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
      <FundDetailShell bodyClassName="items-center justify-center" onBackPress={handleBackPress}>
        {isDetailLoadSlow ? (
          <SlowRequestReloadState onRetry={handleRetryLoad} layout="screen" />
        ) : (
          <Spinner fullscreen size="lg" accessibilityLabel="Cargando ficha del fondo" />
        )}
      </FundDetailShell>
    );
  }

  if (loadError) {
    return (
      <FundDetailShell bodyClassName="min-h-0 flex-1" onBackPress={handleBackPress}>
        <FundApiErrorState
          title="No se pudo cargar la ficha"
          message={loadError}
          onRetry={handleRetryLoad}
          secondaryActionLabel="Volver al catálogo"
          onSecondaryAction={handleBackPress}
          layout="screen"
          className="flex-1"
        />
      </FundDetailShell>
    );
  }

  if (notFound || !detail) {
    return (
      <FundDetailShell bodyClassName="min-h-0 flex-1" onBackPress={handleBackPress}>
        <FundApiErrorState
          title="Fondo no encontrado"
          message="No encontramos una ficha para este ISIN en el catálogo educativo."
          variant="warning"
          secondaryActionLabel="Volver al catálogo"
          onSecondaryAction={handleBackPress}
          layout="screen"
          className="flex-1"
        />
      </FundDetailShell>
    );
  }

  const { fund } = detail;
  const showPerformanceHistory = hasPerformanceHistory(detail);

  return (
    <FundDetailShell onBackPress={handleBackPress} onSoraPress={handleOpenSora}>
      <ScrollView
        className="min-h-0 flex-1"
        contentContainerClassName="items-center"
        // tailwind-exception: safe-area bottom inset is runtime-only
        contentContainerStyle={{
          paddingBottom: insets.bottom + Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="gap-md self-center pt-sm"
          // tailwind-exception: content width follows mobile layout breakpoint
          style={{
            width: contentWidth,
            maxWidth: contentWidth,
            paddingHorizontal: Layout.screenPaddingHorizontal,
          }}
        >
          <View className="gap-xs">
            {detail.rank != null ? (
              <TextLabel variant="meta" themeColor="deepOcean">
                Ranking #{detail.rank}
              </TextLabel>
            ) : null}
            <View className="flex-row items-start gap-sm">
              <FundCardIcon
                symbol={fund.symbol}
                logoUrl={fund.logoUrl}
                size="md"
                accessibilityLabel={`Logo ${fund.issuer ?? fund.symbol}`}
                className="mt-half"
              />
              <View className="min-w-0 flex-1 gap-xs">
                <TextHeading variant="card" className="tracking-[-0.36px]" numberOfLines={3}>
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
              <View className="mt-half shrink-0">
                <FavoriteToggleButton
                  isin={fund.isin}
                  isFavorite={isFavorite}
                  isLoading={isFavoriteLoading}
                  onToggle={toggle}
                />
              </View>
            </View>

            {performanceSeries && performanceSeries.points.length >= 2 ? (
              <View className="mt-xs flex-row items-center gap-xs">
                <MaterialCommunityIcons
                  name={performanceTrendUp ? 'trending-up' : 'trending-down'}
                  size={18}
                  color={theme.primary}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                />
                <TextParagraph variant="emphasis" themeColor="primary">
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

          <View className="flex-row gap-sm">
            <Button
              label="Pregúntale a Sora"
              variant="primary"
              className="flex-1"
              accessibilityLabel="Pregúntale a Sora, asistente educativo"
              accessibilityHint="Abre el asistente educativo con contexto de este fondo"
              onPress={handleOpenSora}
            />
            <Button
              label="Comparar"
              variant="primary"
              className="flex-1 bg-deep-ocean"
              accessibilityLabel={`Comparar ${fund.name} con otros fondos`}
              onPress={() => {
                void navigateToCompare([fund.isin]);
              }}
            />
          </View>

          <Button
            label="Simular inversión"
            variant="secondary"
            fullWidth
            accessibilityLabel={`Simular inversión con ${fund.name} en la calculadora`}
            accessibilityHint="Abre la calculadora de interés compuesto con este fondo como referencia"
            onPress={() => navigateToCalculator(fund.isin)}
          />

          {showPerformanceHistory ? (
            <View className="gap-sm self-stretch">
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
