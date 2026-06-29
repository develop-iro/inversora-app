import type { CatalogFund } from '@/core/domain/catalog';
import { AppError } from '@/core/errors/app-error';
import {
  mapApiFundToCatalogFund,
  type ApiFund,
  type ApiFundEditorial,
  type ApiFundMetrics,
} from '@/core/api/map-api-fund';

export type FundListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FundListResponse = {
  data: CatalogFund[];
  meta: FundListMeta;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseApiFundMetrics(value: unknown): ApiFundMetrics | null {
  if (!isRecord(value)) {
    return null;
  }

  const readNumber = (key: keyof ApiFundMetrics): number | null => {
    const raw = value[key];
    return typeof raw === 'number' ? raw : raw === null ? null : null;
  };

  return {
    ter: readNumber('ter'),
    aum: readNumber('aum'),
    volatility: readNumber('volatility'),
    drawdown: readNumber('drawdown'),
    per: readNumber('per'),
    dividendYield: readNumber('dividendYield'),
    trackingError: readNumber('trackingError'),
  };
}

function parseApiFundEditorial(value: unknown): ApiFundEditorial | null {
  if (!isRecord(value)) {
    return null;
  }

  const { badge, themeLabel, idealForBeginners } = value;

  if (
    typeof badge !== 'string' ||
    typeof themeLabel !== 'string' ||
    typeof idealForBeginners !== 'boolean'
  ) {
    return null;
  }

  return { badge, themeLabel, idealForBeginners };
}

function parseApiFund(value: unknown): ApiFund | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    id,
    symbol,
    isin,
    name,
    issuer,
    logoUrl,
    benchmark,
    metrics,
    riskLevel,
    score,
    editorial,
    catalogVisibility,
  } = value;

  const parsedMetrics = parseApiFundMetrics(metrics);
  const parsedEditorial = parseApiFundEditorial(editorial);

  if (
    typeof id !== 'string' ||
    typeof symbol !== 'string' ||
    (typeof isin !== 'string' && isin !== null) ||
    typeof name !== 'string' ||
    (typeof issuer !== 'string' && issuer !== null) ||
    (typeof logoUrl !== 'string' && logoUrl !== null) ||
    (typeof benchmark !== 'string' && benchmark !== null) ||
    parsedMetrics === null ||
    (typeof riskLevel !== 'number' && riskLevel !== null) ||
    (typeof score !== 'number' && score !== null) ||
    parsedEditorial === null ||
    (catalogVisibility !== 'visible' &&
      catalogVisibility !== 'quarantined' &&
      catalogVisibility !== 'blocked')
  ) {
    return null;
  }

  return {
    id,
    symbol,
    isin,
    name,
    issuer: issuer ?? null,
    logoUrl: logoUrl ?? null,
    benchmark,
    metrics: parsedMetrics,
    riskLevel,
    score,
    editorial: parsedEditorial,
    catalogVisibility,
  };
}

function parseFundListMeta(value: unknown): FundListMeta | null {
  if (!isRecord(value)) {
    return null;
  }

  const { page, limit, total, totalPages } = value;

  if (
    typeof page !== 'number' ||
    typeof limit !== 'number' ||
    typeof total !== 'number' ||
    typeof totalPages !== 'number'
  ) {
    return null;
  }

  return { page, limit, total, totalPages };
}

/**
 * Parses and maps the `GET /funds` response to catalog cards.
 *
 * @param payload - Raw JSON payload from the API.
 */
export function parseFundListResponse(payload: unknown): FundListResponse {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta del catálogo no tiene el formato esperado.',
    );
  }

  const meta = parseFundListMeta(payload.meta);

  if (meta === null) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La respuesta del catálogo no incluye metadatos de paginación.',
    );
  }

  const data = payload.data
    .map((entry) => {
      const apiFund = parseApiFund(entry);
      return apiFund === null ? null : mapApiFundToCatalogFund(apiFund);
    })
    .filter((entry): entry is CatalogFund => entry !== null);

  return { data, meta };
}
