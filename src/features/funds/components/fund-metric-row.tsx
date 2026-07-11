import { View } from 'react-native';

import { TextLabel } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

export type FundMetricRowProps = {
  icon: string;
  label: string;
  className?: string;
};

export function FundMetricRow({ icon, label, className }: FundMetricRowProps) {
  return (
    <View className={cn('flex-row items-center gap-xs', className)}>
      <TextLabel variant="chip" className="min-w-4 text-center">
        {icon}
      </TextLabel>
      <TextLabel variant="meta" themeColor="textSecondary" className="shrink">
        {label}
      </TextLabel>
    </View>
  );
}
