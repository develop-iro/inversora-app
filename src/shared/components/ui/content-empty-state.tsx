import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { StatusIcon } from '@/shared/components/ui/status-icon';
import type { StatusIconVariant } from '@/shared/components/ui/status-icon-tokens';
import { cn } from '@/shared/utils/cn';

export type ContentEmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: StatusIconVariant;
  children?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Calm empty state for sections with no data yet (not a load failure).
 */
export function ContentEmptyState({
  title,
  message,
  actionLabel,
  onAction,
  variant = 'warning',
  children,
  className,
  style,
}: ContentEmptyStateProps) {
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${message}`}
      className={cn('w-full items-center px-lg py-xl', className)}
      style={style}
    >
      <View className="w-full max-w-[420px] items-center gap-lg">
        <StatusIcon variant={variant} size="lg" />

        <View className="w-full items-center gap-sm">
          <TextParagraph variant="emphasis" className="text-center leading-[22px]">
            {title}
          </TextParagraph>
          <TextParagraph
            variant="secondary"
            themeColor="textSecondary"
            className="text-center leading-5"
          >
            {message}
          </TextParagraph>
        </View>

        {actionLabel && onAction ? (
          <Button
            variant="outline"
            size="md"
            label={actionLabel}
            accessibilityLabel={actionLabel}
            onPress={onAction}
            className="w-full"
          />
        ) : null}

        {children}
      </View>
    </View>
  );
}
