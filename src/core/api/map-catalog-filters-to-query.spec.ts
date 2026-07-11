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

  it('maps return threshold filter for one-year period', () => {
    assert.deepEqual(
      mapCatalogFiltersToApiQuery({
        minReturnPercent: 5,
        returnPeriod: '1y',
      }),
      {
        sortBy: 'score',
        sortOrder: 'desc',
        minReturn1y: 5,
      },
    );
  });

  it('maps return threshold filter for three-year period', () => {
    assert.deepEqual(
      mapCatalogFiltersToApiQuery({
        minReturnPercent: 10,
        returnPeriod: '3y',
      }).minReturn3y,
      10,
    );
  });
});
