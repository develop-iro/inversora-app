import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { RankedFund } from '@/core/scoring/types';

import {
  BEGINNER_MIN_SCORE,
  applyBeginnerGuardsToHomeSearchResult,
  filterBeginnerEligibleRankingGroups,
  shouldApplyBeginnerSurfaceGuards,
} from './beginner-eligibility';

function buildRankedFund(score: number, rank: number): RankedFund {
  return {
    rank,
    isin: `ES0${rank}0000000`,
    name: `Fund ${rank}`,
    categoryLabel: 'Índice global',
    score,
    riskLevel: 'medium',
    terPercent: 0.2,
    status: 'ok',
    breakdown: [],
    returns: { ytd: null, oneYear: null, threeYear: null, asOf: null },
  };
}

describe('beginner-eligibility', () => {
  it('defaults beginner surface guards when profile is missing', () => {
    assert.equal(shouldApplyBeginnerSurfaceGuards(null), true);
    assert.equal(shouldApplyBeginnerSurfaceGuards(undefined), true);
  });

  it('applies beginner guards only for beginner knowledge level', () => {
    assert.equal(
      shouldApplyBeginnerSurfaceGuards({ knowledgeLevel: 'beginner' }),
      true,
    );
    assert.equal(
      shouldApplyBeginnerSurfaceGuards({ knowledgeLevel: 'intermediate' }),
      false,
    );
    assert.equal(
      shouldApplyBeginnerSurfaceGuards({ knowledgeLevel: 'advanced' }),
      false,
    );
  });

  it('filters ranking groups below the beginner score floor', () => {
    const groups: BenchmarkRankingGroup[] = [
      {
        benchmark: 'MSCI World',
        benchmarkKey: 'msci-world',
        total: 2,
        funds: [buildRankedFund(BEGINNER_MIN_SCORE, 1), buildRankedFund(10, 2)],
      },
    ];

    const filtered = filterBeginnerEligibleRankingGroups(groups);

    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.funds.length, 1);
    assert.equal(filtered[0]?.funds[0]?.score, BEGINNER_MIN_SCORE);
    assert.equal(filtered[0]?.total, 1);
    assert.equal(filtered[0]?.funds[0]?.rank, 1);
  });

  it('filters home search ranking rows for beginner surfaces', () => {
    const result = applyBeginnerGuardsToHomeSearchResult({
      kind: 'default',
      subtitle: 'Ranking educativo',
      funds: [
        {
          ...buildRankedFund(80, 1),
          displayRank: 1,
          isHighlighted: true,
        },
        {
          ...buildRankedFund(20, 2),
          displayRank: 2,
          isHighlighted: false,
        },
      ],
    });

    assert.ok(result);
    assert.equal(result.funds.length, 1);
    assert.equal(result.funds[0]?.displayRank, 1);
    assert.equal(result.funds[0]?.isHighlighted, true);
  });
});
