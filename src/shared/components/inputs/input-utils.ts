/**
 * Visual state for text inputs.
 */
export type InputVariant = 'default' | 'error';

/**
 * Keeps only digits and a single decimal comma for localized numeric fields.
 *
 * @param raw - Raw user input.
 */
export function sanitizeLocalizedDecimalInput(raw: string): string {
  const cleaned = raw.replace(/[^\d,]/g, '');
  const commaIndex = cleaned.indexOf(',');

  if (commaIndex === -1) {
    return cleaned;
  }

  const integerPart = cleaned.slice(0, commaIndex);
  const fractionalPart = cleaned.slice(commaIndex + 1).replace(/,/g, '');

  return `${integerPart},${fractionalPart}`;
}

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
