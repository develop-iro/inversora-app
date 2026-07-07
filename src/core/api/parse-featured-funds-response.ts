import type { FeaturedFund } from '@/core/domain/fund';
import { AppError } from '@/core/errors/app-error';
import { resolveFundReturnSnapshotFromApi } from '@/core/api/parse-fund-return-snapshot';

const RISK_LEVELS = new Set(['low', 'medium', 'high']);
const DIVERSIFICATION_LEVELS = new Set(['low', 'medium', 'high']);

export type FeaturedFundsResponse = {
  quarter: string;
  quarterTag: string;
  periodStart: string;
  periodEnd: string;
  data: FeaturedFund[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseFeaturedFund(value: unknown): FeaturedFund | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    id,
    isin,
    symbol,
    issuer,
    logoUrl,
    name,
    categoryLabel,
    themeLabel,
    badge,
    idealForBeginners,
    efficiencyScore,
    terPercent,
    riskLevel,
    diversification,
    quarterTag,
    periodStart,
    periodEnd,
    benefitSummary,
    featuredReason,
    isFeatured,
    returns,
  } = value;

  if (
    typeof id !== 'string' ||
    typeof isin !== 'string' ||
    typeof symbol !== 'string' ||
    (typeof issuer !== 'string' && issuer !== null) ||
    (typeof logoUrl !== 'string' && logoUrl !== null) ||
    typeof name !== 'string' ||
    typeof categoryLabel !== 'string' ||
    typeof themeLabel !== 'string' ||
    typeof badge !== 'string' ||
    typeof idealForBeginners !== 'boolean' ||
    typeof efficiencyScore !== 'number' ||
    typeof terPercent !== 'number' ||
    typeof riskLevel !== 'string' ||
    !RISK_LEVELS.has(riskLevel) ||
    typeof diversification !== 'string' ||
    !DIVERSIFICATION_LEVELS.has(diversification) ||
    typeof quarterTag !== 'string' ||
    typeof periodStart !== 'string' ||
    typeof periodEnd !== 'string' ||
    typeof benefitSummary !== 'string' ||
    typeof featuredReason !== 'string' ||
    typeof isFeatured !== 'boolean'
  ) {
    return null;
  }

  return {
    id,
    isin,
    symbol,
    issuer: issuer ?? null,
    logoUrl: logoUrl ?? null,
    name,
    categoryLabel,
    themeLabel,
    badge,
    idealForBeginners,
    efficiencyScore,
    terPercent,
    riskLevel: riskLevel as FeaturedFund['riskLevel'],
    diversification: diversification as FeaturedFund['diversification'],
    quarterTag: quarterTag as FeaturedFund['quarterTag'],
    periodStart,
    periodEnd,
    benefitSummary,
    featuredReason,
    isFeatured,
    returns: resolveFundReturnSnapshotFromApi(returns),
  };
}

/**
 * Parses and validates the `GET /featured` response envelope.
 *
 * @param payload - Raw JSON payload from the API.
 */
export function parseFeaturedFundsResponse(
  payload: unknown,
): FeaturedFundsResponse {
  if (!isRecord(payload)) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta de destacados no tiene el formato esperado.',
    );
  }

  const { quarter, quarterTag, periodStart, periodEnd, data } = payload;

  if (
    typeof quarter !== 'string' ||
    typeof quarterTag !== 'string' ||
    typeof periodStart !== 'string' ||
    typeof periodEnd !== 'string' ||
    !Array.isArray(data)
  ) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta de destacados no incluye metadatos de trimestre.',
    );
  }

  const funds = data
    .map((entry) => parseFeaturedFund(entry))
    .filter((entry): entry is FeaturedFund => entry !== null);

  return {
    quarter,
    quarterTag,
    periodStart,
    periodEnd,
    data: funds,
  };
}
