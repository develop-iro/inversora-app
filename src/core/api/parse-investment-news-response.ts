import {
  isInvestmentNewsCategory,
  type InvestmentNewsItem,
} from '@/core/domain/investment-news';
import { AppError } from '@/core/errors/app-error';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseInvestmentNewsItem(value: unknown): InvestmentNewsItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, title, summary, source, publishedAt, category, url } = value;

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof summary !== 'string' ||
    typeof source !== 'string' ||
    typeof publishedAt !== 'string' ||
    typeof category !== 'string' ||
    !isInvestmentNewsCategory(category)
  ) {
    return null;
  }

  if (url !== undefined && typeof url !== 'string') {
    return null;
  }

  return {
    id,
    title,
    summary,
    source,
    publishedAt,
    category,
    ...(typeof url === 'string' ? { url } : {}),
  };
}

function parseInvestmentNewsList(value: unknown): InvestmentNewsItem[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items = value
    .map((entry) => parseInvestmentNewsItem(entry))
    .filter((entry): entry is InvestmentNewsItem => entry !== null);

  if (items.length !== value.length) {
    return null;
  }

  return items;
}

/**
 * Parses a news list payload from `GET /news`.
 *
 * @param payload - Raw API JSON.
 */
export function parseInvestmentNewsResponse(payload: unknown): InvestmentNewsItem[] {
  const direct = parseInvestmentNewsList(payload);

  if (direct) {
    return direct;
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    const wrapped = parseInvestmentNewsList(payload.data);

    if (wrapped) {
      return wrapped;
    }
  }

  throw new AppError(
    'API_INVALID_RESPONSE',
    'La respuesta de noticias no tiene el formato esperado.',
  );
}
