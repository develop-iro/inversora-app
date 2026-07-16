import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FundDetailProfile } from '@/core/domain/fund-detail-profile';
import {
  extractProfileSummaryValue,
  parseCurrencyFromNote,
} from '@/features/comparison/utils/extract-profile-summary-value';

function buildProfile(
  summaryRows: FundDetailProfile['summaryRows'],
  currencyNote = '',
): FundDetailProfile {
  return {
    asOf: '2026-06-30',
    sourceLabel: 'test',
    description: 'test',
    manager: 'test',
    benchmark: 'MSCI World',
    isIndexed: true,
    fundAum: '1M',
    inceptionDate: '2010-01-01',
    summaryRows,
    feeRows: [],
    documents: [],
    returnsByPeriod: [],
    returnsByYear: [],
    currencyNote,
    methodNote: 'test',
    ratiosByHorizon: { '12m': [], '3y': [], '5y': [] },
    exposureByTab: {
      sectorial: [],
      regional: [],
      assetAllocation: [],
      capitalization: [],
      portfolio: [],
    },
    distributors: [],
  };
}

describe('extractProfileSummaryValue', () => {
  it('reads trimmed summary row values by id', () => {
    const profile = buildProfile([
      { id: 'currency', label: 'Divisa', value: ' EUR ' },
      { id: 'vehicle', label: 'Vehículo', value: '' },
    ]);

    assert.equal(extractProfileSummaryValue(profile, 'currency'), 'EUR');
    assert.equal(extractProfileSummaryValue(profile, 'vehicle'), null);
    assert.equal(extractProfileSummaryValue(profile, 'missing'), null);
  });
});

describe('parseCurrencyFromNote', () => {
  it('extracts a three-letter currency code from the note', () => {
    assert.equal(parseCurrencyFromNote('* Calculada en usd'), 'USD');
    assert.equal(parseCurrencyFromNote('Sin divisa'), null);
  });
});
