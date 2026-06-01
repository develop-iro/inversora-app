import type { RiskLevel } from '@/core/domain/fund';
import type { RankedFund } from '@/core/scoring/types';

export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'Bajo';
    case 'high':
      return 'Alto';
    case 'medium':
    default:
      return 'Medio';
  }
}

export function getRiskBadgeVariant(risk: RiskLevel): 'mint' | 'danger' | 'warning' {
  switch (risk) {
    case 'low':
      return 'mint';
    case 'high':
      return 'danger';
    case 'medium':
    default:
      return 'warning';
  }
}

export function buildRankingA11yLabel(fund: RankedFund): string {
  const riskLabel = getRiskLabel(fund.riskLevel).toLowerCase();
  return `Ranking ${fund.rank}, ${fund.name}, Score Invesora ${fund.score} sobre 100, riesgo ${riskLabel}, comisión anual ${fund.terPercent.toFixed(2)} por ciento.`;
}
