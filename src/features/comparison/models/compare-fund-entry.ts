import type { FundDetail } from '@/core/domain/catalog';

/** Load state for a single fund in the comparison selection. */
export type CompareFundEntry = {
  readonly isin: string;
  readonly detail: FundDetail | null;
  readonly errorMessage: string | null;
};

/** Result of evaluating whether an educational comparison is homogeneous. */
export type CompareFairnessResult = {
  readonly isFair: boolean;
  readonly warnings: readonly string[];
};

/** A single row in the mobile-first comparison metrics layout. */
export type CompareMetricRow = {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly values: readonly CompareMetricValue[];
  /** When set, lower numeric values receive subtle emphasis (e.g. TER). */
  readonly emphasizeLower?: boolean;
};

export type CompareMetricValue = {
  readonly isin: string;
  readonly fundLabel: string;
  readonly displayValue: string;
  readonly numericValue?: number;
  readonly isMissing: boolean;
};

/** Group of related metric rows shown inside a collapsible section. */
export type CompareMetricGroup = {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly rows: readonly CompareMetricRow[];
};
