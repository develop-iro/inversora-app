import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { RankedFund } from '@/core/scoring/types';

import {
  BEGINNER_MIN_SCORE,
  applyBeginnerGuardsToHomeSearchResult,
  filterBeginnerEligibleRankingGroups,
  hasCompletedBeginnerProfile,
  shouldApplyBeginnerSurfaceGuards,
  shouldPreferLearnTabEntryPoint,
  shouldShowHomeStarterSection,
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

  it('detects completed beginner profiles for redundant learn entry points', () => {
    assert.equal(hasCompletedBeginnerProfile(null), false);
    assert.equal(hasCompletedBeginnerProfile(undefined), false);
    assert.equal(hasCompletedBeginnerProfile({ knowledgeLevel: 'beginner' }), true);
    assert.equal(hasCompletedBeginnerProfile({ knowledgeLevel: 'intermediate' }), false);
    assert.equal(hasCompletedBeginnerProfile({ knowledgeLevel: 'advanced' }), false);
  });

  it('prefers the Aprendizaje tab when profile is missing or beginner', () => {
    assert.equal(shouldPreferLearnTabEntryPoint(null), true);
    assert.equal(shouldPreferLearnTabEntryPoint(undefined), true);
    assert.equal(shouldPreferLearnTabEntryPoint({ knowledgeLevel: 'beginner' }), true);
    assert.equal(shouldPreferLearnTabEntryPoint({ knowledgeLevel: 'intermediate' }), false);
    assert.equal(shouldPreferLearnTabEntryPoint({ knowledgeLevel: 'advanced' }), false);
  });

  it('never shows the home starter section on web', () => {
    assert.equal(
      shouldShowHomeStarterSection({
        platformOs: 'web',
        hasSkippedInitialProfiling: true,
        profile: null,
      }),
      false,
    );
  });

  it('shows the home starter section only for native users who skipped initial profiling', () => {
    const skippedWithoutProfile = {
      platformOs: 'ios',
      hasSkippedInitialProfiling: true,
      profile: null,
    } as const;

    assert.equal(shouldShowHomeStarterSection(skippedWithoutProfile), true);
    assert.equal(
      shouldShowHomeStarterSection({ ...skippedWithoutProfile, platformOs: 'android' }),
      true,
    );
    assert.equal(
      shouldShowHomeStarterSection({ ...skippedWithoutProfile, hasSkippedInitialProfiling: false }),
      false,
    );
    assert.equal(
      shouldShowHomeStarterSection({
        ...skippedWithoutProfile,
        profile: { knowledgeLevel: 'intermediate' },
      }),
      false,
    );
    assert.equal(
      shouldShowHomeStarterSection({
        ...skippedWithoutProfile,
        profile: { knowledgeLevel: 'beginner' },
      }),
      false,
    );
    assert.equal(
      shouldShowHomeStarterSection({
        ...skippedWithoutProfile,
        isProfileLoading: true,
      }),
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
