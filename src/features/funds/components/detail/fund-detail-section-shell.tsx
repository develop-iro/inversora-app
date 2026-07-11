import type { ReactNode } from 'react';
import { View } from 'react-native';

import { HeaderSection } from '@/shared/components/headers/header-section';
import { InfoHintTrigger } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export type FundDetailSectionShellProps = {
  title: string;
  subtitle?: string;
  hintTerm?: string;
  hintExplanation?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Shared section wrapper for fund detail blocks: {@link HeaderSection} + body slot.
 */
export function FundDetailSectionShell({
  title,
  subtitle,
  hintTerm,
  hintExplanation,
  children,
  className,
}: FundDetailSectionShellProps) {
  return (
    <View className={cn('gap-sm self-stretch', className)}>
      <HeaderSection
        title={title}
        summary={subtitle}
        variant="compact"
        // tailwind-exception: HeaderSection has no className prop yet
        style={{ paddingBottom: 0 }}
        action={
          hintTerm && hintExplanation ? (
            <InfoHintTrigger
              surface="detail"
              term={hintTerm}
              explanation={hintExplanation}
            />
          ) : undefined
        }
      />
      <View className="gap-md">{children}</View>
    </View>
  );
}
