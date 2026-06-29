import type { FundDetail } from '@/core/domain/catalog';

import type { CompareMetricRow, CompareMetricValue } from '@/features/comparison/models/compare-fund-entry';
import { getRiskLabel } from '@/shared/utils/fund-risk';

const MISSING_VALUE = '—';

function formatTer(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} %`;
}

function formatReturnPercent(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1).replace('.', ',')} %`;
}

function buildValue(
  detail: FundDetail,
  displayValue: string,
  options?: { numericValue?: number; isMissing?: boolean },
): CompareMetricValue {
  const shortLabel =
    detail.fund.symbol.length > 0 ? detail.fund.symbol : detail.fund.isin.slice(-4);

  return {
    isin: detail.fund.isin,
    fundLabel: shortLabel,
    displayValue,
    numericValue: options?.numericValue,
    isMissing: options?.isMissing ?? displayValue === MISSING_VALUE,
  };
}

function buildRow(
  id: string,
  label: string,
  details: readonly FundDetail[],
  resolveValue: (detail: FundDetail) => CompareMetricValue,
  options?: { emphasizeLower?: boolean },
): CompareMetricRow {
  return {
    id,
    label,
    emphasizeLower: options?.emphasizeLower,
    values: details.map(resolveValue),
  };
}

function findTrackingError(detail: FundDetail): string {
  const ratios = detail.profile.ratiosByHorizon['12m'];
  const trackingRow = ratios.find((row) => row.id === 'trackingError');

  if (trackingRow === undefined || trackingRow.value === 'n/a') {
    return MISSING_VALUE;
  }

  return trackingRow.value;
}

function findReturn1Y(detail: FundDetail): CompareMetricValue {
  const period = detail.profile.returnsByPeriod.find((entry) => entry.id === '1y');

  if (period === undefined || period.percent === null) {
    return buildValue(detail, MISSING_VALUE, { isMissing: true });
  }

  return buildValue(detail, formatReturnPercent(period.percent), {
    numericValue: period.percent,
  });
}

/**
 * Builds the primary comparison table rows shown in the metrics card.
 *
 * @param details - Loaded fund details in display order.
 */
export function buildCompareTableRows(details: readonly FundDetail[]): CompareMetricRow[] {
  if (details.length === 0) {
    return [];
  }

  return [
    buildRow('score', 'Score Inversora', details, (detail) =>
      buildValue(detail, String(detail.inversoraScore), {
        numericValue: detail.inversoraScore,
      }),
    ),
    buildRow(
      'ter',
      'TER',
      details,
      (detail) =>
        buildValue(detail, formatTer(detail.fund.terPercent), {
          numericValue: detail.fund.terPercent,
        }),
      { emphasizeLower: true },
    ),
    buildRow('risk', 'Riesgo', details, (detail) =>
      buildValue(detail, getRiskLabel(detail.fund.riskLevel)),
    ),
    buildRow('category', 'Categoría', details, (detail) =>
      buildValue(detail, detail.fund.categoryLabel),
    ),
    buildRow('return1y', 'Rentab. 1 año', details, (detail) => findReturn1Y(detail)),
    buildRow('tracking', 'Tracking error', details, (detail) => {
      const value = findTrackingError(detail);

      return buildValue(detail, value, { isMissing: value === MISSING_VALUE });
    }),
  ];
}
