import { z } from 'zod';

import { FUND_ISIN_REGEX } from './fund-isin.pattern';

/** ISO 6166 ISIN pattern used by fund route parameters. */
export { FUND_ISIN_REGEX } from './fund-isin.pattern';

/** Zod schema for a normalized fund ISIN route parameter. */
export const fundIsinParamSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(FUND_ISIN_REGEX, 'Invalid ISIN format'));

/**
 * Returns whether a route identifier looks like a valid ISIN.
 *
 * @param identifier - Raw route parameter value.
 */
export function isFundIsin(identifier: string): boolean {
  return fundIsinParamSchema.safeParse(identifier).success;
}

/**
 * Normalizes a validated ISIN route parameter to uppercase.
 *
 * @param isin - Raw ISIN route parameter.
 */
export function normalizeFundIsin(isin: string): string {
  return fundIsinParamSchema.parse(isin);
}

/**
 * Parses and filters a list of raw ISIN values from deep-link params.
 *
 * @param values - Raw ISIN values.
 */
export function parseFundIsinList(values: readonly string[]): string[] {
  return values
    .map((value) => value.trim().toUpperCase())
    .filter((value) => FUND_ISIN_REGEX.test(value));
}

/**
 * Parses an optional ISIN deep-link parameter.
 *
 * @param value - Raw route parameter value.
 */
export function parseOptionalFundIsinParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = fundIsinParamSchema.safeParse(raw);

  return parsed.success ? parsed.data : undefined;
}
