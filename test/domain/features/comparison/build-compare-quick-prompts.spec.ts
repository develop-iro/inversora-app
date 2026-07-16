import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseFundDetailResponse } from '@/core/api/parse-fund-detail-response';
import { buildCompareQuickPrompts } from '@/features/comparison/utils/build-compare-quick-prompts';
import { buildFeaturedFund } from '@test/support/fixtures/featured-fund';
import { buildFundDetailPayload } from '@test/support/fixtures/fund-detail-payload';

describe('buildCompareQuickPrompts', () => {
  it('includes base prompts and fairness limitations when unfair', () => {
    const prompts = buildCompareQuickPrompts(
      [
        parseFundDetailResponse(
          buildFundDetailPayload({
            fund: buildFeaturedFund({ isin: 'IE00A', terPercent: 0.1 }),
            inversoraScore: 90,
          }),
        ),
        parseFundDetailResponse(
          buildFundDetailPayload({
            fund: buildFeaturedFund({ isin: 'IE00B', terPercent: 0.4 }),
            inversoraScore: 88,
            profile: {
              ...buildFundDetailPayload().profile,
              benchmark: 'S&P 500',
            },
          }),
        ),
      ],
      { isFair: false, warnings: ['benchmarks'] },
    );

    assert.ok(prompts.includes('¿Qué diferencia hay en el TER?'));
    assert.ok(prompts.includes('¿Qué limitaciones tiene esta comparación?'));
    assert.ok(prompts.includes('¿Por qué importa esta diferencia de TER?'));
    assert.ok(prompts.length <= 5);
  });

  it('adds a data-quality prompt when scoring status is warning', () => {
    const prompts = buildCompareQuickPrompts([
      parseFundDetailResponse(
        buildFundDetailPayload({
          scoringStatus: 'warning',
          inversoraScore: 70,
        }),
      ),
    ]);

    assert.ok(prompts.includes('¿Por qué algún fondo tiene datos limitados?'));
  });
});
