import { View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

export type FundDetailSectionEmptyStateProps = {
  message: string;
  className?: string;
};

/**
 * Inline placeholder for fund detail sections without enough data to render charts or lists.
 */
export function FundDetailSectionEmptyState({
  message,
  className,
}: FundDetailSectionEmptyStateProps) {
  return (
    <View className={cn('py-md', className)} accessibilityRole="text">
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {message}
      </TextParagraph>
    </View>
  );
}
