import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mapCatalogFiltersToApiQuery } from './map-catalog-filters-to-query';

describe('mapCatalogFiltersToApiQuery', () => {
  it('maps sort options to API query params', () => {
    assert.deepEqual(
      mapCatalogFiltersToApiQuery({
        sortBy: 'ter',
        sortOrder: 'asc',
      }),
      {
        sortBy: 'ter',
        sortOrder: 'asc',
      },
    );
  });

  it('maps return sort preset', () => {
    assert.deepEqual(
      mapCatalogFiltersToApiQuery({
        sortBy: 'return1y',
        sortOrder: 'desc',
      }).sortBy,
      'return1y',
    );
  });
});
