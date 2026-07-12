import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatCatalogLoadProgress } from '@/features/funds/utils/format-catalog-load-progress';

describe('formatCatalogLoadProgress', () => {
  it('returns null while refreshing', () => {
    assert.equal(formatCatalogLoadProgress(11, 5051, { isRefreshing: true }), null);
  });

  it('returns null when total is unknown', () => {
    assert.equal(formatCatalogLoadProgress(11, null), null);
  });

  it('returns null when all funds are loaded', () => {
    assert.equal(formatCatalogLoadProgress(42, 42), null);
  });

  it('formats partial pagination with filtered total', () => {
    assert.equal(formatCatalogLoadProgress(11, 48), '11 de 48 fondos');
  });

  it('uses singular fund wording for one result', () => {
    assert.equal(formatCatalogLoadProgress(0, 1), '0 de 1 fondo');
  });
});
