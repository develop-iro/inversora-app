import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { DEFAULT_CATALOG_FILTERS } from '@/features/funds/types/fund-catalog-filters';
import {
  buildCatalogPreviewServiceFilters,
  formatCatalogFiltersApplyLabel,
} from '@/features/funds/utils/catalog-filter-presentation';

describe('buildCatalogPreviewServiceFilters', () => {
  it('maps draft filters and uses the debounced search query', () => {
    const filters = buildCatalogPreviewServiceFilters(
      {
        ...DEFAULT_CATALOG_FILTERS,
        riskLevel: 'medium',
        maxTerPercent: 0.25,
        minScore: 80,
        minReturnPercent: 5,
        returnPeriod: '1y',
        categoryLabel: 'msci-world',
      },
      'world',
    );

    assert.equal(filters.query, 'world');
    assert.equal(filters.riskLevel, 'medium');
    assert.equal(filters.maxTerPercent, 0.25);
    assert.equal(filters.minScore, 80);
    assert.equal(filters.minReturnPercent, 5);
    assert.equal(filters.returnPeriod, '1y');
    assert.equal(filters.categoryLabel, 'msci-world');
  });
});

describe('formatCatalogFiltersApplyLabel', () => {
  it('formats plural fund counts in Spanish locale', () => {
    assert.equal(formatCatalogFiltersApplyLabel(5051), 'Ver 5051 fondos');
  });

  it('formats singular fund counts', () => {
    assert.equal(formatCatalogFiltersApplyLabel(1), 'Ver 1 fondo');
  });

  it('falls back when the preview count is unavailable', () => {
    assert.equal(formatCatalogFiltersApplyLabel(null), 'Ver fondos');
  });
});
