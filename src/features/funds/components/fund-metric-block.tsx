import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { InfoHintTrigger } from '@/shared/components/ui/info-hint';
import type { InfoHintSurface } from '@/shared/platform/capabilities';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type FundMetricBlockProps = {
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  hintTerm?: string;
  hintExplanation?: string;
  surface?: InfoHintSurface;
  value: ReactNode;
  className?: string;
};

export function FundMetricBlock({
  icon,
  label,
  hintTerm,
  hintExplanation,
  surface = 'catalog',
  value,
  className,
}: FundMetricBlockProps) {
  const theme = useTheme();
  const showHint = hintTerm != null && hintExplanation != null;

  return (
    <View className={cn('min-w-0 flex-1', className)}>
      <View className="flex-row items-start gap-xs">
        {icon ? (
          <MaterialCommunityIcons name={icon} size={16} color={theme.deepOcean} />
        ) : null}
        <View className="min-w-0 flex-1 gap-xs">
          <View className="flex-row items-center gap-half">
            <TextLabel variant="meta" themeColor="textSecondary">
              {label}
            </TextLabel>
            {showHint ? (
              <InfoHintTrigger
                term={hintTerm}
                explanation={hintExplanation}
                surface={surface}
              />
            ) : null}
          </View>
          {typeof value === 'string' || typeof value === 'number' ? (
            <TextParagraph variant="emphasis" className="leading-[22px]">
              {value}
            </TextParagraph>
          ) : (
            value
          )}
        </View>
      </View>
    </View>
  );
}
