import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  resolveTabBarDisplayLabel,
  resolveTabBarLayoutMetrics,
  TAB_BAR_COMPACT_SLOT_WIDTH,
} from '@/shared/navigation/tab-bar-layout';

describe('resolveTabBarLayoutMetrics', () => {
  it('marks iPhone-width screens as compact and tightens horizontal insets', () => {
    const metrics = resolveTabBarLayoutMetrics(390, 'ios');

    assert.equal(metrics.barWidth, 358);
    assert.ok(metrics.perTabWidth < TAB_BAR_COMPACT_SLOT_WIDTH);
    assert.equal(metrics.isCompact, true);
    assert.equal(metrics.labelFontSize, 9);
    assert.equal(metrics.minimumFontScale, 0.75);
  });

  it('uses roomier metrics on wider screens', () => {
    const metrics = resolveTabBarLayoutMetrics(480, 'ios');

    assert.ok(metrics.perTabWidth >= TAB_BAR_COMPACT_SLOT_WIDTH);
    assert.equal(metrics.isCompact, false);
    assert.equal(metrics.labelFontSize, 11);
  });
});

describe('resolveTabBarDisplayLabel', () => {
  it('returns compact copy only when layout is compact', () => {
    assert.equal(
      resolveTabBarDisplayLabel('Aprendizaje', 'Aprende', true),
      'Aprende',
    );
    assert.equal(
      resolveTabBarDisplayLabel('Aprendizaje', 'Aprende', false),
      'Aprendizaje',
    );
    assert.equal(resolveTabBarDisplayLabel('Inicio', undefined, true), 'Inicio');
  });
});
