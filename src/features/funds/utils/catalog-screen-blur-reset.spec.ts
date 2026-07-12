import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { DEFAULT_CATALOG_FILTERS } from '@/features/funds/types/fund-catalog-filters';
import { countActiveCatalogFilters } from '@/features/funds/utils/catalog-filter-presentation';
import { resolveCatalogScreenBlurReset } from '@/features/funds/utils/catalog-screen-blur-reset';

describe('resolveCatalogScreenBlurReset', () => {
  it('restores default catalog filters', () => {
    const reset = resolveCatalogScreenBlurReset();

    assert.deepEqual(reset.filters, DEFAULT_CATALOG_FILTERS);
    assert.equal(countActiveCatalogFilters(reset.filters), 0);
  });

  it('closes ephemeral catalog overlays', () => {
    const reset = resolveCatalogScreenBlurReset();

    assert.equal(reset.isFiltersVisible, false);
    assert.equal(reset.isSoraVisible, false);
    assert.equal(reset.isProfileHintsDismissed, false);
  });

  it('clears active filter selections such as risk level', () => {
    const activeFilters = {
      ...DEFAULT_CATALOG_FILTERS,
      riskLevel: 'medium' as const,
      categoryLabel: 'global-equity',
      maxTerPercent: 0.15,
      query: 'msci',
    };

    assert.equal(countActiveCatalogFilters(activeFilters), 3);

    const reset = resolveCatalogScreenBlurReset();

    assert.equal(reset.filters.riskLevel, 'all');
    assert.equal(reset.filters.categoryLabel, 'all');
    assert.equal(reset.filters.maxTerPercent, null);
    assert.equal(reset.filters.query, '');
    assert.equal(countActiveCatalogFilters(reset.filters), 0);
  });
});
