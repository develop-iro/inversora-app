import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { StatusIcon } from '@/shared/components/ui/status-icon';
import type { StatusIconVariant } from '@/shared/components/ui/status-icon-tokens';
import { cn } from '@/shared/utils/cn';

export type ReloadStateLayout = 'screen' | 'section';

export type ReloadStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: StatusIconVariant;
  /** `screen` centers the block in the available body; `section` stacks compactly inside a section. */
  layout?: ReloadStateLayout;
  children?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Retry and recoverable error state with a generic status icon.
 */
export function ReloadState({
  title,
  message,
  actionLabel = 'Reintentar',
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'error',
  layout = 'section',
  children,
  className,
  style,
}: ReloadStateProps) {
  const isScreenLayout = layout === 'screen';

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={`${title}. ${message}`}
      className={cn(
        'w-full items-center px-lg',
        isScreenLayout ? 'min-h-0 flex-1 justify-center py-xl' : 'py-xl',
        className,
      )}
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

        {onAction || (secondaryActionLabel && onSecondaryAction) ? (
          <View className="w-full gap-sm">
            {onAction ? (
              <Button
                variant="primary"
                size="md"
                label={actionLabel}
                accessibilityLabel={actionLabel}
                onPress={onAction}
                className="w-full"
              />
            ) : null}

            {secondaryActionLabel && onSecondaryAction ? (
              <Button
                variant="outline"
                size="md"
                label={secondaryActionLabel}
                accessibilityLabel={secondaryActionLabel}
                onPress={onSecondaryAction}
                className="w-full"
              />
            ) : null}
          </View>
        ) : null}

        {children}
      </View>
    </View>
  );
}
