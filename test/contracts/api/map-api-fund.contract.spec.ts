import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildApiCategoryLabel,
  buildApiThemeLabel,
  mapApiFundToCatalogFund,
  mapApiRiskLevelToApp,
} from '@/core/api/map-api-fund';
import { buildApiFund } from '@test/support/fixtures/api-fund';

describe('mapApiRiskLevelToApp', () => {
  it('maps numeric API risk bands to app labels', () => {
    assert.equal(mapApiRiskLevelToApp(null), 'medium');
    assert.equal(mapApiRiskLevelToApp(1), 'low');
    assert.equal(mapApiRiskLevelToApp(2), 'low');
    assert.equal(mapApiRiskLevelToApp(3), 'medium');
    assert.equal(mapApiRiskLevelToApp(5), 'medium');
    assert.equal(mapApiRiskLevelToApp(6), 'high');
    assert.equal(mapApiRiskLevelToApp(7), 'high');
  });
});

describe('buildApiCategoryLabel', () => {
  it('prefers the benchmark index label when present', () => {
    assert.equal(
      buildApiCategoryLabel(buildApiFund({ benchmark: 'S&P 500' })),
      'Índice S&P 500',
    );
  });

  it('falls back when benchmark is missing', () => {
    assert.equal(buildApiCategoryLabel(buildApiFund({ benchmark: null })), 'Fondo indexado');
    assert.equal(buildApiCategoryLabel(buildApiFund({ benchmark: '   ' })), 'Fondo indexado');
  });
});

describe('buildApiThemeLabel', () => {
  it('returns Spanish labels for canonical themes', () => {
    assert.equal(buildApiThemeLabel('global-equity'), 'Renta variable global');
    assert.equal(buildApiThemeLabel('us-equity'), 'Renta variable USA');
  });
});

describe('mapApiFundToCatalogFund', () => {
  it('maps a visible API fund into a catalog card', () => {
    const catalogFund = mapApiFundToCatalogFund(buildApiFund());

    assert.ok(catalogFund);
    assert.equal(catalogFund.isin, 'IE00TEST0001');
    assert.equal(catalogFund.inversoraScore, 85);
    assert.equal(catalogFund.riskLevel, 'medium');
    assert.equal(catalogFund.terPercent, 0.12);
    assert.equal(catalogFund.catalogVisibility, 'visible');
    assert.equal(catalogFund.idealForBeginners, true);
  });

  it('rejects funds without ISIN', () => {
    assert.equal(mapApiFundToCatalogFund(buildApiFund({ isin: null })), null);
    assert.equal(mapApiFundToCatalogFund(buildApiFund({ isin: '   ' })), null);
  });

  it('rejects unknown catalog visibility values', () => {
    assert.equal(
      mapApiFundToCatalogFund(
        buildApiFund({
          // Cast: contract must reject values outside the public union.
          catalogVisibility: 'hidden' as never,
        }),
      ),
      null,
    );
  });

  it('derives beginner suitability when editorial content is empty', () => {
    const catalogFund = mapApiFundToCatalogFund(
      buildApiFund({
        score: 80,
        riskLevel: 3,
        metrics: {
          ter: 0.2,
          aum: null,
          volatility: null,
          drawdown: null,
          per: null,
          dividendYield: null,
          trackingError: null,
        },
        editorial: {
          badge: '',
          themeLabel: '',
          idealForBeginners: false,
        },
      }),
    );

    assert.ok(catalogFund);
    assert.equal(catalogFund.idealForBeginners, true);
    assert.equal(catalogFund.badge, 'En catálogo');
  });
});
