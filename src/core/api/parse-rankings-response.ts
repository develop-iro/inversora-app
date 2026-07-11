import { mapApiRiskLevelToApp } from '@/core/api/map-api-fund';
import {
  EMPTY_FUND_HISTORICAL_RETURNS,
  parseFundReturnSnapshot,
} from '@/core/api/parse-fund-return-snapshot';
import { AppError } from '@/core/errors/app-error';
import type { FundHistoricalReturns, RankedFund } from '@/core/scoring/types';
type ApiFundReturnSnapshot = FundHistoricalReturns;

export type ApiRankedFundEntry = {
  rank: number;
  id: string;
  symbol: string;
  isin: string;
  name: string;
  score: number;
  benchmark: string;
  currency: string;
  riskLevel: number | null;
  ter: number;
  returns?: ApiFundReturnSnapshot;
};

type ApiBenchmarkRankingGroup = {
  benchmark: string;
  benchmarkKey: string;
  total: number;
  funds: ApiRankedFundEntry[];
};

export type BenchmarkRankingGroup = {
  benchmark: string;
  benchmarkKey: string;
  total: number;
  funds: RankedFund[];
};

export type ApiRankingsResponse = {
  data: ApiBenchmarkRankingGroup[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseRankedFundEntry(value: unknown): ApiRankedFundEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    rank,
    id,
    symbol,
    isin,
    name,
    score,
    benchmark,
    currency,
    riskLevel,
    ter,
    returns,
  } = value;

  if (
    typeof rank !== 'number' ||
    typeof id !== 'string' ||
    typeof symbol !== 'string' ||
    typeof isin !== 'string' ||
    typeof name !== 'string' ||
    typeof score !== 'number' ||
    typeof benchmark !== 'string' ||
    typeof currency !== 'string' ||
    (typeof riskLevel !== 'number' && riskLevel !== null) ||
    typeof ter !== 'number'
  ) {
    return null;
  }

  const parsedReturns =
    returns === undefined ? undefined : parseFundReturnSnapshot(returns);

  if (returns !== undefined && parsedReturns === null) {
    return null;
  }

  const entry: ApiRankedFundEntry = {
    rank,
    id,
    symbol,
    isin,
    name,
    score,
    benchmark,
    currency,
    riskLevel,
    ter,
  };

  if (parsedReturns !== undefined && parsedReturns !== null) {
    entry.returns = parsedReturns;
  }

  return entry;
}

function parseBenchmarkRankingGroup(value: unknown): ApiBenchmarkRankingGroup | null {
  if (!isRecord(value)) {
    return null;
  }

  const { benchmark, benchmarkKey, total, funds } = value;

  if (
    typeof benchmark !== 'string' ||
    typeof benchmarkKey !== 'string' ||
    typeof total !== 'number' ||
    !Array.isArray(funds)
  ) {
    return null;
  }

  const parsedFunds = funds
    .map((entry) => parseRankedFundEntry(entry))
    .filter((entry): entry is ApiRankedFundEntry => entry !== null);

  return {
    benchmark,
    benchmarkKey,
    total,
    funds: parsedFunds,
  };
}

/**
 * Parses and validates the `GET /rankings` response envelope.
 *
 * @param payload - Raw JSON payload from the API.
 */
export function parseRankingsResponse(payload: unknown): ApiRankingsResponse {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'El ranking de fondos no tiene el formato esperado.',
    );
  }

  const data = payload.data
    .map((group) => parseBenchmarkRankingGroup(group))
    .filter((group): group is ApiBenchmarkRankingGroup => group !== null);

  return { data };
}

/**
 * Maps a single API ranked fund entry to the app `RankedFund` shape.
 *
 * @param entry - Parsed API ranking row.
 */
export function mapRankingEntryToRankedFund(entry: ApiRankedFundEntry): RankedFund {
  return {
    isin: entry.isin,
    name: entry.name,
    categoryLabel: `Índice ${entry.benchmark}`,
    score: Math.round(entry.score),
    riskLevel: mapApiRiskLevelToApp(entry.riskLevel),
    terPercent: entry.ter,
    status: 'ok',
    breakdown: [],
    rank: entry.rank,
    returns: entry.returns ?? EMPTY_FUND_HISTORICAL_RETURNS,
  };
}

/**
 * Maps parsed API ranking groups to domain groups preserving benchmark-local ranks.
 *
 * @param response - Parsed rankings response.
 */
export function mapRankingsResponseToGroups(
  response: ApiRankingsResponse,
): BenchmarkRankingGroup[] {
  return response.data.map((group) => ({
    benchmark: group.benchmark,
    benchmarkKey: group.benchmarkKey,
    total: group.total,
    funds: group.funds.map((entry) => mapRankingEntryToRankedFund(entry)),
  }));
}

/**
 * Maps API ranking groups to a globally ordered `RankedFund` list for cross-benchmark search.
 *
 * Funds from every benchmark group are merged and re-ranked by score (RN-02 groups are
 * preserved in the API; the dashboard shows a cross-benchmark educational preview).
 *
 * @param response - Parsed rankings response.
 */
export function flattenRankingsToRankedFunds(
  response: ApiRankingsResponse,
): RankedFund[] {
  const entries = response.data.flatMap((group) => group.funds);

  const sorted = [...entries].sort((left, right) => {
    const scoreDifference = right.score - left.score;

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.symbol.localeCompare(right.symbol);
  });

  return sorted.map((entry, index) => mapRankingEntryToRankedFund({ ...entry, rank: index + 1 }));
}
