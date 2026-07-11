import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { FUND_GLOSSARY } from '@/shared/constants/fund-glossary';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import {
  formatReturnPercent,
  resolveReturnColorToken,
} from '@/shared/utils/format-return-percent';
import { cn } from '@/shared/utils/cn';

export type FundReturnChipProps = {
  label: string;
  value: number | null;
  variant?: 'plain' | 'surface';
  accessibilityHint?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function FundReturnChip({
  label,
  value,
  variant = 'plain',
  accessibilityHint = FUND_GLOSSARY.pastPerformance.explanation,
  className,
  style,
}: FundReturnChipProps) {
  const displayValue = value === null ? '—' : formatReturnPercent(value);
  const colorToken = value === null ? 'textSecondary' : resolveReturnColorToken(value);
  const isSurface = variant === 'surface';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${displayValue}. ${accessibilityHint}`}
      className={cn(
        'min-w-[52px] items-end gap-half',
        isSurface &&
          'min-h-[52px] w-full self-stretch items-center justify-center rounded-pill border border-border bg-surface-muted px-md py-sm',
        className,
      )}
      style={style}
    >
      <TextLabel
        variant="meta"
        themeColor="textSecondary"
        className={cn(isSurface && 'tracking-[0.88px]')}
      >
        {label}
      </TextLabel>
      {isSurface ? (
        <TextLabel
          variant="chip"
          themeColor={colorToken}
          className={cn(typographyClassNames.scoreHero, 'tabular-nums')}
        >
          {displayValue}
        </TextLabel>
      ) : (
        <TextParagraph variant="secondary" themeColor={colorToken} className="tabular-nums">
          {displayValue}
        </TextParagraph>
      )}
    </View>
  );
}
