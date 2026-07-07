import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { HeaderSection, type HeaderSectionVariant } from '@/shared/components/headers';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import { Spacing } from '@/shared/theme/theme';

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
  const theme = useTheme();
  const shadows = useThemeShadows();
  const hasHeader = Boolean(title);
  const cardColors =
    surface === 'muted'
      ? {
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.primaryBorderFaint,
        }
      : {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        };

  const resolvedContentClassName = [
    'px-lg pt-lg pb-lg gap-md',
    hasHeader && headerPlacement === 'inside' ? 'pt-0' : null,
    bleedContent ? 'px-0' : null,
    contentClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <View className={resolvedContentClassName} style={contentStyle}>
      {children}
    </View>
  );

  return (
    <View className={['gap-sm', className].filter(Boolean).join(' ')} style={style}>
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
        <View className="overflow-hidden rounded-card border" style={[cardColors, shadows.card]}>
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
