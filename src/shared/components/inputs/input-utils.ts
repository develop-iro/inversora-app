/**
 * Visual state for text inputs.
 */
export type InputVariant = 'default' | 'error';

/**
 * Parses a localized numeric string (`1.234,56` or `1234.56`) into a number.
 */
export function parseLocalizedNumber(raw: string): number {
  const normalized = raw.trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');

  if (normalized.length === 0) {
    return 0;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Formats a number for editable numeric fields in Spanish locale style.
 */
export function formatLocalizedDecimal(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return value.toFixed(fractionDigits).replace('.', ',');
}
