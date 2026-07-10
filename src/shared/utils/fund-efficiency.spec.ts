import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getEfficiencyLabel } from './fund-efficiency';

describe('getEfficiencyLabel', () => {
  it('maps score ranges to HU-15 labels', () => {
    assert.equal(getEfficiencyLabel(95), 'Líder de categoría');
    assert.equal(getEfficiencyLabel(80), 'Muy eficiente');
    assert.equal(getEfficiencyLabel(60), 'Consistente');
    assert.equal(getEfficiencyLabel(35), 'Mejorable');
    assert.equal(getEfficiencyLabel(10), 'Bajo rendimiento técnico');
  });
});
