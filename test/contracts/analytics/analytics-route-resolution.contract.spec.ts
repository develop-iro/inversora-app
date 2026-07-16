import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  resolveAnalyticsRouteProperties,
  resolveAnalyticsSurface,
} from '@/core/analytics/analytics-route-resolution';

describe('resolveAnalyticsSurface', () => {
  it('maps known MVP routes to stable surface ids', () => {
    assert.equal(resolveAnalyticsSurface('/'), 'home');
    assert.equal(resolveAnalyticsSurface('/funds'), 'funds_catalog');
    assert.equal(resolveAnalyticsSurface('/funds/IE00B4L5Y983'), 'fund_detail');
    assert.equal(resolveAnalyticsSurface('/learn'), 'learn_curriculum');
    assert.equal(resolveAnalyticsSurface('/questionnaire'), 'learn_questionnaire');
    assert.equal(resolveAnalyticsSurface('/compare'), 'compare');
  });
});

describe('resolveAnalyticsRouteProperties', () => {
  it('extracts fund ISIN from fund detail paths', () => {
    assert.deepEqual(resolveAnalyticsRouteProperties('/funds/ie00b4l5y983'), {
      isin: 'IE00B4L5Y983',
    });
  });

  it('returns undefined for routes without extra properties', () => {
    assert.equal(resolveAnalyticsRouteProperties('/'), undefined);
  });
});
