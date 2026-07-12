import type { InvestmentTheme } from '@/core/domain/investment-theme';
import type { RankedFund } from '@/core/scoring/types';

type ThemeRule = {
  readonly theme: InvestmentTheme;
  readonly pattern: RegExp;
};

const THEME_RULES: readonly ThemeRule[] = [
  {
    theme: 'esg',
    pattern:
      /\b(esg|sustainable|sustainability|clean energy|renewable|solar|carbon|paris[\s-]?aligned|sri|green bond|climate)\b/i,
  },
  {
    theme: 'technology',
    pattern:
      /\b(semiconductor|technology|technolog|nasdaq[\s-]?100|\bqqq\b|cyber|artificial intelligence|\bai\b|robotics|cloud computing|internet|fintech|innovation)\b/i,
  },
  {
    theme: 'fixed-income',
    pattern:
      /\b(bond|treasury|aggregate|tips|municipal|high yield|credit|duration|fixed rate|investment grade|fixed income)\b/i,
  },
  {
    theme: 'multi-asset',
    pattern:
      /\b(target date|target-date|balanced|multi[\s-]?asset|allocation|moderate|conservative growth|lifecycle|life cycle|all[\s-]?weather)\b/i,
  },
  {
    theme: 'us-equity',
    pattern:
      /\b(s&p\s*500|sp\s*500|russell\s*(200|1000|3000)?|dow jones|total stock market|us total market|wilshire|crsp|nasdaq composite|usa\b|u\.s\.|united states)\b/i,
  },
  {
    theme: 'europe-equity',
    pattern:
      /\b(europe|euro stoxx|stoxx\s*600|ftse\s*100|msci europe|msci emu|dax|cac\s*40|eurozone)\b/i,
  },
  {
    theme: 'emerging-equity',
    pattern:
      /\b(emerging|em market|frontier|msci em|msci emerging|bric|developing market)\b/i,
  },
  {
    theme: 'global-equity',
    pattern:
      /\b(msci world|ftse all[\s-]?world|all[\s-]?country|acwi|global equity|world equity|world stock|world index|developed market)\b/i,
  },
  {
    theme: 'sector-other',
    pattern:
      /\b(gold|silver|oil|energy sector|real estate|reit|healthcare sector|financial sector|utilities sector|materials sector|commodity|uranium|biotech|pharma|defense|aerospace|water|infrastructure|timber|agriculture|lithium|copper|metals|mining|bitcoin|ethereum|dogecoin|crypto|blockchain)\b/i,
  },
];

/**
 * Extracts the benchmark label from a ranking category label.
 *
 * @param categoryLabel - App ranking category label.
 */
export function extractBenchmarkFromCategoryLabel(categoryLabel: string): string {
  return categoryLabel.replace(/^Índice\s+/i, '').trim();
}

/**
 * Infers a canonical investment theme from ranked-fund metadata.
 *
 * @param fund - Ranked fund row shown on home or rankings surfaces.
 */
export function inferInvestmentThemeFromRankedFund(fund: Pick<RankedFund, 'name' | 'categoryLabel'>): InvestmentTheme {
  const benchmark = extractBenchmarkFromCategoryLabel(fund.categoryLabel);
  const corpus = `${fund.name} ${benchmark}`.replace(/\s+/g, ' ').trim();

  if (corpus.length === 0) {
    return 'unclassified';
  }

  for (const rule of THEME_RULES) {
    if (rule.pattern.test(corpus)) {
      return rule.theme;
    }
  }

  return 'unclassified';
}
