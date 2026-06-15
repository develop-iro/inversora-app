import type { QuarterTag } from '@/core/domain/fund';

export type QuarterMetadata = {
  quarter: string;
  quarterTag: QuarterTag;
  periodStart: string;
  periodEnd: string;
};

/**
 * Resolves the current UTC quarter metadata for catalog cards without BFF context.
 */
export function resolveCurrentQuarterMetadata(
  referenceDate: Date = new Date(),
): QuarterMetadata {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const quarterIndex = Math.floor(month / 3);
  const quarterNumber = (quarterIndex + 1) as 1 | 2 | 3 | 4;
  const periodStartMonth = quarterIndex * 3;
  const periodEndMonth = periodStartMonth + 2;
  const periodEndDay = new Date(Date.UTC(year, periodEndMonth + 1, 0)).getUTCDate();

  return {
    quarter: `${year}-Q${quarterNumber}`,
    quarterTag: `Q${quarterNumber} ${year}` as QuarterTag,
    periodStart: formatIsoDate(year, periodStartMonth, 1),
    periodEnd: formatIsoDate(year, periodEndMonth, periodEndDay),
  };
}

function formatIsoDate(year: number, month: number, day: number): string {
  const monthLabel = String(month + 1).padStart(2, '0');
  const dayLabel = String(day).padStart(2, '0');
  return `${year}-${monthLabel}-${dayLabel}`;
}
