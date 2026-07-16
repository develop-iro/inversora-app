import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';
import type { AssistantExplainResponse } from '@/features/assistant/types/assistant-context';
import { createHomeSearchService } from '@/features/onboarding/services/resolve-home-search.factory';
import { createRankingsService } from '@/features/funds/services/get-rankings.factory';
import { createMemoryHttpGet } from '@test/support/doubles/memory-http-get';

function buildGroups(): BenchmarkRankingGroup[] {
  return [
    {
      benchmark: 'MSCI World',
      benchmarkKey: 'msci-world',
      total: 1,
      funds: [
        {
          rank: 1,
          isin: 'IE00B4L5Y983',
          name: 'MSCI World Index Core',
          categoryLabel: 'Renta Variable Global',
          riskLevel: 'medium',
          terPercent: 0.12,
          score: 91,
          status: 'ok',
          breakdown: [],
          returns: {
            ytd: 4.2,
            oneYear: 11.5,
            threeYear: 28.1,
            asOf: '2026-06-30',
          },
        },
      ],
    },
  ];
}

describe('resolve-home-search application', () => {
  it('returns the default ranking preview for an empty query', async () => {
    const rankings = createRankingsService({
      apiGet: createMemoryHttpGet().apiGet,
      shouldUseMockData: () => true,
    });
    const service = createHomeSearchService({
      getRankingsGrouped: rankings.getRankingsGrouped,
      explainAssistant: async () => {
        throw new Error('assistant should not run');
      },
      allowsMockFallback: () => true,
    });

    const result = await service.resolveHomeSearch('   ');

    assert.equal(result.kind, 'default');
    assert.ok(result.funds.length > 0);
  });

  it('returns fund matches for a concrete fund query', async () => {
    const service = createHomeSearchService({
      getRankingsGrouped: async () => buildGroups(),
      explainAssistant: async () => {
        throw new Error('assistant should not run for fund matches');
      },
      allowsMockFallback: () => false,
    });

    const result = await service.resolveHomeSearch('MSCI World');

    assert.equal(result.kind, 'fund-match');
    if (result.kind !== 'fund-match') {
      return;
    }

    assert.equal(result.funds[0]?.isin, 'IE00B4L5Y983');
    assert.equal(result.funds[0]?.isHighlighted, true);
  });

  it('asks the assistant for question-like queries and keeps the disclaimer', async () => {
    const assistantResponse: AssistantExplainResponse = {
      text: 'El TER es la comisión anual del fondo.',
      title: 'Qué es el TER',
      source: 'glossary',
      cached: false,
      disclaimer: 'Información educativa, no asesoramiento financiero.',
      relatedFundIsin: 'IE00B4L5Y983',
      promptVersion: 'test',
    };
    const service = createHomeSearchService({
      getRankingsGrouped: async () => buildGroups(),
      explainAssistant: async (request) => {
        assert.equal(request.surface, 'home');
        assert.match(request.message, /qué es/i);
        return assistantResponse;
      },
      allowsMockFallback: () => false,
    });

    const result = await service.resolveHomeSearch('¿Qué es el TER?');

    assert.equal(result.kind, 'answer');
    if (result.kind !== 'answer') {
      return;
    }

    assert.equal(result.answer.title, 'Qué es el TER');
    assert.equal(
      result.answer.disclaimer,
      'Información educativa, no asesoramiento financiero.',
    );
    assert.equal(result.funds[0]?.isin, 'IE00B4L5Y983');
  });
});
