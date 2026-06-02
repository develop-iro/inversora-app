/** Key-value row for summary / fees tables. */
export type FundProfileRow = {
  id: string;
  label: string;
  value: string;
  /** When set, value is shown as a link-style emphasis (educational, not a broker action). */
  emphasis?: 'link';
};

export type FundDocumentRow = {
  id: string;
  label: string;
  status: 'available' | 'coming_soon';
  url?: string;
};

export type FundReturnPeriod = {
  id: string;
  label: string;
  /** Percent return; null = no data (e.g. fund younger than horizon). */
  percent: number | null;
};

export type FundReturnYear = {
  year: number;
  percent: number | null;
};

export type RatioHorizon = '12m' | '3y' | '5y';

export type FundRatioRow = {
  id: string;
  label: string;
  value: string;
};

export type ExposureTabId =
  | 'sectorial'
  | 'regional'
  | 'assetAllocation'
  | 'capitalization'
  | 'portfolio';

export type AllocationSlice = {
  label: string;
  percent: number;
  /** MaterialCommunityIcons name for sectorial rows. */
  icon?: string;
};

export type FundDistributorKind = 'bank' | 'broker';

/** Illustrative bank/broker where the fund may be available (not a purchase link). */
export type FundDistributor = {
  id: string;
  name: string;
  kind: FundDistributorKind;
  /** Optional note, e.g. share class or platform context. */
  note?: string;
};

export type FundDetailProfile = {
  asOf: string;
  sourceLabel: string;
  description: string;
  manager: string;
  benchmark: string;
  isIndexed: boolean;
  fundAum: string;
  classAum?: string;
  inceptionDate: string;
  summaryRows: FundProfileRow[];
  feeRows: FundProfileRow[];
  documents: FundDocumentRow[];
  returnsByPeriod: FundReturnPeriod[];
  returnsByYear: FundReturnYear[];
  currencyNote: string;
  methodNote: string;
  ratiosByHorizon: Record<RatioHorizon, FundRatioRow[]>;
  exposureByTab: Record<ExposureTabId, AllocationSlice[]>;
  /** Orientative list of banks/brokers; user must verify on each platform. */
  distributors: FundDistributor[];
};
