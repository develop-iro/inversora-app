import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { HeaderSection, type HeaderSectionVariant } from '@/shared/components/headers';
import { Spacing } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

/** Horizontal padding applied inside elevated section cards. */
export const SECTION_CARD_CONTENT_INSET = Spacing.lg;

export type SectionCardSurface = 'default' | 'muted';

export type SectionCardProps = {
  children: ReactNode;
  title?: string;
  summary?: string;
  headerAction?: ReactNode;
  loading?: boolean;
  headerPlacement?: 'above' | 'inside';
  className?: string;
  style?: StyleProp<ViewStyle>;
  contentClassName?: string;
  contentStyle?: StyleProp<ViewStyle>;
  /** Removes horizontal padding from the card body (e.g. horizontal carousels). */
  bleedContent?: boolean;
  /** When true, omits the outer card shell and only renders the section header + body gap. */
  borderless?: boolean;
  headerVariant?: HeaderSectionVariant;
  surface?: SectionCardSurface;
};

/**
 * Section wrapper with optional elevated card shell and shared header spacing.
 */
export function SectionCard({
  children,
  title,
  summary,
  headerAction,
  headerPlacement = 'above',
  loading = false,
  className,
  style,
  contentClassName,
  contentStyle,
  bleedContent = false,
  borderless = false,
  headerVariant = 'compact',
  surface = 'default',
}: SectionCardProps) {
  const hasHeader = Boolean(title);

  const shellClassName =
    surface === 'muted'
      ? 'overflow-hidden rounded-card border border-primary-border-faint bg-background-soft'
      : 'overflow-hidden rounded-card border border-border bg-surface shadow-card';

  const body = (
    <View
      className={cn(
        'gap-md px-lg pb-lg pt-lg',
        hasHeader && headerPlacement === 'inside' && 'pt-0',
        bleedContent && 'px-0',
        contentClassName,
      )}
      style={contentStyle}
    >
      {children}
    </View>
  );

  return (
    <View className={cn('gap-sm', className)} style={style}>
      {hasHeader && headerPlacement === 'above' ? (
        <HeaderSection
          loading={loading}
          title={title!}
          summary={summary}
          variant={headerVariant}
          action={headerAction}
        />
      ) : null}

      {borderless ? (
        body
      ) : (
        <View className={shellClassName}>
          {hasHeader && headerPlacement === 'inside' ? (
            <View className="px-lg pt-lg">
              <HeaderSection
                loading={loading}
                title={title!}
                summary={summary}
                variant={headerVariant}
                action={headerAction}
              />
            </View>
          ) : null}
          {body}
        </View>
      )}
    </View>
  );
}
