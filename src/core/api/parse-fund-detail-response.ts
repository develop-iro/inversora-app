import type { FundDetail } from '@/core/domain/catalog';
import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';
import type {
  FundMarketSnapshot,
  FundPerformanceSeries,
  FundPerformanceTimeframe,
} from '@/core/domain/fund-market';
import type { FeaturedFund } from '@/core/domain/fund';
import { AppError } from '@/core/errors/app-error';
import type { ScoreBreakdown, ScoringStatus } from '@/core/scoring/types';
import { parseFeaturedFund } from '@/core/api/parse-featured-funds-response';

const SCORING_STATUSES = new Set<ScoringStatus>(['ok', 'warning', 'quarantined']);
const SCORE_CRITERION_IDS = new Set([
  'ter',
  'tracking',
  'aum',
  'age',
  'consistency',
  'dataQuality',
]);
const PERFORMANCE_TIMEFRAMES: FundPerformanceTimeframe[] = [
  'ytd',
  '1y',
  '3y',
  '5y',
  'max',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseScoreBreakdown(value: unknown): ScoreBreakdown | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const breakdown: ScoreBreakdown = [];

  for (const entry of value) {
    if (!isRecord(entry)) {
      return null;
    }

    const { id, label, points, maxPoints } = entry;

    if (
      typeof id !== 'string' ||
      !SCORE_CRITERION_IDS.has(id) ||
      typeof label !== 'string' ||
      typeof points !== 'number' ||
      typeof maxPoints !== 'number'
    ) {
      return null;
    }

    breakdown.push({
      id: id as ScoreBreakdown[number]['id'],
      label,
      points,
      maxPoints,
    });
  }

  return breakdown.length === 6 ? breakdown : null;
}

function parsePerformanceSeries(value: unknown): FundPerformanceSeries | null {
  if (!isRecord(value)) {
    return null;
  }

  const { timeframe, points, asOf, sourceLabel } = value;

  if (
    typeof timeframe !== 'string' ||
    !PERFORMANCE_TIMEFRAMES.includes(timeframe as FundPerformanceTimeframe) ||
    !Array.isArray(points) ||
    typeof asOf !== 'string' ||
    typeof sourceLabel !== 'string'
  ) {
    return null;
  }

  const parsedPoints = points
    .map((point) => {
      if (!isRecord(point)) {
        return null;
      }

      const { date, value: pointValue } = point;

      if (typeof date !== 'string' || typeof pointValue !== 'number') {
        return null;
      }

      return { date, value: pointValue };
    })
    .filter((point): point is FundPerformanceSeries['points'][number] => point !== null);

  return {
    timeframe: timeframe as FundPerformanceTimeframe,
    points: parsedPoints,
    asOf,
    sourceLabel,
  };
}

function parseMarketSnapshot(value: unknown): FundMarketSnapshot | null {
  if (!isRecord(value) || !isRecord(value.performanceByTimeframe)) {
    return null;
  }

  const performanceByTimeframe = {} as FundMarketSnapshot['performanceByTimeframe'];

  for (const timeframe of PERFORMANCE_TIMEFRAMES) {
    const series = parsePerformanceSeries(value.performanceByTimeframe[timeframe]);

    if (series === null) {
      return null;
    }

    performanceByTimeframe[timeframe] = series;
  }

  if (!Array.isArray(value.regions) || typeof value.stabilityLabel !== 'string') {
    return null;
  }

  const regions = value.regions
    .map((region) => {
      if (!isRecord(region)) {
        return null;
      }

      const { label, percent } = region;

      if (typeof label !== 'string' || typeof percent !== 'number') {
        return null;
      }

      return { label, percent };
    })
    .filter((region): region is FundMarketSnapshot['regions'][number] => region !== null);

  const stabilityChangePercent =
    typeof value.stabilityChangePercent === 'number'
      ? value.stabilityChangePercent
      : undefined;

  return {
    performanceByTimeframe,
    regions,
    stabilityLabel: value.stabilityLabel,
    stabilityChangePercent,
  };
}

function parseProfile(value: unknown): FundDetailProfile | null {
  if (!isRecord(value)) {
    return null;
  }

  const requiredStrings = [
    'asOf',
    'sourceLabel',
    'description',
    'manager',
    'benchmark',
    'fundAum',
    'inceptionDate',
    'currencyNote',
    'methodNote',
  ] as const;

  for (const key of requiredStrings) {
    if (typeof value[key] !== 'string') {
      return null;
    }
  }

  if (typeof value.tracksIndex !== 'boolean') {
    return null;
  }

  const arrayFields = [
    'summaryRows',
    'feeRows',
    'documents',
    'returnsByPeriod',
    'returnsByYear',
    'distributors',
  ] as const;

  for (const key of arrayFields) {
    if (!Array.isArray(value[key])) {
      return null;
    }
  }

  if (!isRecord(value.ratiosByHorizon) || !isRecord(value.exposureByTab)) {
    return null;
  }

  const asOf = value.asOf as string;
  const sourceLabel = value.sourceLabel as string;
  const description = value.description as string;
  const manager = value.manager as string;
  const benchmark = value.benchmark as string;
  const fundAum = value.fundAum as string;
  const inceptionDate = value.inceptionDate as string;
  const currencyNote = value.currencyNote as string;
  const methodNote = value.methodNote as string;

  return {
    asOf,
    sourceLabel,
    description,
    manager,
    benchmark,
    isIndexed: value.tracksIndex,
    fundAum,
    classAum: typeof value.classAum === 'string' ? value.classAum : undefined,
    inceptionDate,
    summaryRows: value.summaryRows as FundDetailProfile['summaryRows'],
    feeRows: value.feeRows as FundDetailProfile['feeRows'],
    documents: value.documents as FundDetailProfile['documents'],
    returnsByPeriod: value.returnsByPeriod as FundDetailProfile['returnsByPeriod'],
    returnsByYear: value.returnsByYear as FundDetailProfile['returnsByYear'],
    currencyNote,
    methodNote,
    ratiosByHorizon: value.ratiosByHorizon as FundDetailProfile['ratiosByHorizon'],
    exposureByTab: value.exposureByTab as FundDetailProfile['exposureByTab'],
    distributors: value.distributors as FundDetailProfile['distributors'],
  };
}

/**
 * Parses and validates the `GET /funds/:isin` BFF response.
 *
 * @param payload - Raw JSON payload from the API.
 */
export function parseFundDetailResponse(payload: unknown): FundDetail {
  if (!isRecord(payload)) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La ficha del fondo no tiene el formato esperado.',
    );
  }

  const fund = parseFeaturedFund(payload.fund) as FeaturedFund | null;
  const scoredBreakdown = parseScoreBreakdown(payload.scoredBreakdown);
  const market = parseMarketSnapshot(payload.market);
  const profile = parseProfile(payload.profile);
  const { inversoraScore, rank, scoringStatus } = payload;

  if (
    fund === null ||
    scoredBreakdown === null ||
    market === null ||
    profile === null ||
    typeof inversoraScore !== 'number' ||
    (typeof rank !== 'number' && rank != null) ||
    typeof scoringStatus !== 'string' ||
    !SCORING_STATUSES.has(scoringStatus as ScoringStatus)
  ) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La ficha del fondo no incluye todos los campos requeridos.',
    );
  }

  return {
    fund,
    inversoraScore,
    rank: rank ?? undefined,
    scoredBreakdown,
    scoringStatus: scoringStatus as ScoringStatus,
    market,
    profile,
  };
}
