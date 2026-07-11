import { View } from 'react-native';

import { HeaderSection } from '@/shared/components/headers/header-section';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

export type FundMetricCell = {
  id: string;
  label: string;
  value: string;
  /** Optional secondary value (e.g. +0.5%). */
  hint?: string;
};

export type FundMetricsGridProps = {
  title: string;
  metrics: FundMetricCell[];
  className?: string;
};

export function FundMetricsGrid({ title, metrics, className }: FundMetricsGridProps) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <View className={cn('gap-sm self-stretch', className)}>
      <HeaderSection
        title={title}
        variant="compact"
        // tailwind-exception: HeaderSection has no className prop yet
        style={{ paddingBottom: 0 }}
      />
      <View className="flex-row flex-wrap gap-y-md">
        {metrics.map((metric) => (
          <View key={metric.id} className="w-1/2 gap-xs pr-sm">
            <TextLabel variant="meta" themeColor="textSecondary">
              {metric.label}
            </TextLabel>
            <View className="flex-row flex-wrap items-baseline gap-xs">
              <TextParagraph variant="emphasis">{metric.value}</TextParagraph>
              {metric.hint ? (
                <TextParagraph variant="secondary" themeColor="primary">
                  {metric.hint}
                </TextParagraph>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
