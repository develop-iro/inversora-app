import type { FundPerformanceTimeframe } from '@/core/domain/fund-market';
import { PERFORMANCE_TIMEFRAME_OPTIONS } from '@/features/funds/utils/fund-performance';
import { TabChip } from '@/shared/components/tabs/tab-chip';

export type TabChipFundProps = {
  value: FundPerformanceTimeframe;
  onChange: (value: FundPerformanceTimeframe) => void;
};

/**
 * Fund performance chart period chips preset on {@link TabChip}.
 */
export function TabChipFund({ value, onChange }: TabChipFundProps) {
  return (
    <TabChip
      tabs={PERFORMANCE_TIMEFRAME_OPTIONS}
      value={value}
      onChange={onChange}
      accessibilityLabel="Periodo del gráfico de evolución"
      tabAccessibilityPrefix="Periodo"
    />
  );
}
