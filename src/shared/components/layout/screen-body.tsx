import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { cn } from '@/shared/utils/cn';

export type ScreenBodyIntroProps = {
  description?: string;
  children?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Introductory copy block that always lives at the top of a screen body.
 */
export function ScreenBodyIntro({ description, children, className, style }: ScreenBodyIntroProps) {
  return (
    <View className={cn('gap-sm pt-md pb-sm', className)} style={style}>
      {description ? (
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {description}
        </TextParagraph>
      ) : null}
      {children}
    </View>
  );
}

export type ScreenBodyProps = {
  children: ReactNode;
  padded?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Primary scrollable or flex content region below the header.
 */
export function ScreenBody({ children, padded = true, className, style }: ScreenBodyProps) {
  return (
    <View className={cn('min-h-0 flex-1', padded && 'px-lg', className)} style={style}>
      {children}
    </View>
  );
}
