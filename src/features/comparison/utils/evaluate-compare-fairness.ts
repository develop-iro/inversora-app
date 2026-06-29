import type { FundDetail } from '@/core/domain/catalog';

import type { CompareFairnessResult } from '@/features/comparison/models/compare-fund-entry';
import {
  extractProfileSummaryValue,
  parseCurrencyFromNote,
} from '@/features/comparison/utils/extract-profile-summary-value';

type ComparisonFundProfile = {
  readonly isin: string;
  readonly benchmark: string | null;
  readonly currency: string | null;
  readonly vehicle: string | null;
};

function buildComparisonProfile(detail: FundDetail): ComparisonFundProfile {
  const { profile } = detail;

  return {
    isin: detail.fund.isin,
    benchmark: profile.benchmark.trim().length > 0 ? profile.benchmark.trim() : null,
    currency:
      extractProfileSummaryValue(profile, 'currency') ??
      parseCurrencyFromNote(profile.currencyNote),
    vehicle: extractProfileSummaryValue(profile, 'vehicle'),
  };
}

/**
 * Evaluates whether selected funds can be compared fairly in educational copy.
 *
 * @param details - Loaded fund detail payloads in comparison order.
 */
export function evaluateCompareFairness(
  details: readonly FundDetail[],
): CompareFairnessResult {
  if (details.length < 2) {
    return {
      isFair: true,
      warnings: [],
    };
  }

  const profiles = details.map(buildComparisonProfile);
  const warnings: string[] = [];

  const benchmarks = new Set(
    profiles
      .map((fund) => fund.benchmark?.toLowerCase())
      .filter((value): value is string => value !== undefined && value.length > 0),
  );

  const currencies = new Set(
    profiles
      .map((fund) => fund.currency?.toUpperCase())
      .filter((value): value is string => value !== undefined && value.length > 0),
  );

  const vehicles = new Set(
    profiles
      .map((fund) => fund.vehicle?.toLowerCase())
      .filter((value): value is string => value !== undefined && value.length > 0),
  );

  if (benchmarks.size > 1) {
    warnings.push(
      'Los fondos tienen benchmarks distintos; la comparación técnica puede no ser homogénea.',
    );
  }

  if (currencies.size > 1) {
    warnings.push(
      'Los fondos usan divisas distintas; conviene comparar costes y métricas con cautela.',
    );
  }

  if (vehicles.size > 1) {
    warnings.push(
      'Los vehículos de inversión difieren (por ejemplo ETF vs fondo); la comparación puede no ser directa.',
    );
  }

  return {
    isFair: warnings.length === 0,
    warnings,
  };
}
