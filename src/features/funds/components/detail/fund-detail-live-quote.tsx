import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import type { FundLiveMarketSnapshot } from '@/core/domain/fund-live-market';
import { TextParagraph } from '@/shared/components/text';
import { Spinner } from '@/shared/components/ui';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { useTheme } from '@/shared/hooks/use-theme';
import { formatReturnPercent } from '@/shared/utils/format-return-percent';
import { cn } from '@/shared/utils/cn';

export type FundDetailLiveQuoteProps = {
  snapshot: FundLiveMarketSnapshot | null;
  isLoading: boolean;
  className?: string;
};

function formatAsOfLabel(snapshot: FundLiveMarketSnapshot): string {
  const parsedDate = new Date(snapshot.asOf);

  if (Number.isNaN(parsedDate.getTime())) {
    return snapshot.asOf;
  }

  if (snapshot.freshness === 'eod') {
    return parsedDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return parsedDate.toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildHeadline(snapshot: FundLiveMarketSnapshot): string {
  if (snapshot.price === null) {
    return 'Cotización no disponible';
  }

  const priceLabel = snapshot.price.toFixed(2).replace('.', ',');
  const changeLabel =
    snapshot.changePercent === null
      ? null
      : formatReturnPercent(snapshot.changePercent);

  if (snapshot.freshness === 'live') {
    return changeLabel === null
      ? `Cotización reciente · ${priceLabel}`
      : `Cotización reciente · ${changeLabel} hoy`;
  }

  if (snapshot.freshness === 'eod') {
    return changeLabel === null
      ? `Al cierre · ${priceLabel}`
      : `Al cierre · ${changeLabel}`;
  }

  return 'Cotización no disponible';
}

export function FundDetailLiveQuote({
  snapshot,
  isLoading,
  className,
}: FundDetailLiveQuoteProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View
        className={cn('flex-row items-center gap-xs', className)}
        accessibilityLabel="Cargando cotización reciente"
      >
        <Spinner.BarChart size="sm" />
        <TextParagraph variant="secondary" themeColor="textSecondary">
          Actualizando cotización…
        </TextParagraph>
      </View>
    );
  }

  if (snapshot === null || snapshot.freshness === 'unavailable') {
    return null;
  }

  const headline = buildHeadline(snapshot);
  const trendUp = (snapshot.changePercent ?? 0) >= 0;
  const freshnessLabel =
    snapshot.freshness === 'live'
      ? 'Cotización reciente durante horario de mercado'
      : `Al cierre del ${formatAsOfLabel(snapshot)}`;

  return (
    <View
      className={cn(
        'gap-xs rounded-card border border-border bg-surface-muted px-md py-sm',
        className,
      )}
      accessibilityRole="text"
      accessibilityLabel={`${headline}. ${freshnessLabel}. ${FUND_GLOSSARY.pastPerformance.explanation}`}
    >
      <View className="flex-row items-center gap-xs">
        {snapshot.changePercent !== null ? (
          <MaterialCommunityIcons
            name={trendUp ? 'pulse' : 'chart-line-variant'}
            size={16}
            color={trendUp ? theme.success : theme.dangerOnMuted}
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        ) : null}
        <TextParagraph variant="secondary" themeColor="textSecondary" className="flex-1">
          {headline}
        </TextParagraph>
      </View>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {freshnessLabel} · {snapshot.sourceLabel}. {FUND_GLOSSARY.pastPerformance.term}: dato
        orientativo, no recomendación.
      </TextParagraph>
    </View>
  );
}
