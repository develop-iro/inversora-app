import type { ReactNode } from 'react';

import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TextHeading } from '@/shared/components/text/text-heading';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonShimmerProvider } from '@/shared/components/ui/skeleton-shimmer-provider';
import { Radius } from '@/shared/theme/theme';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import type { WithLoading } from '@/shared/types/component-loading';
import { cn } from '@/shared/utils/cn';

export type HeaderSectionVariant = 'prominent' | 'compact';

type HeaderSectionContentProps = {
  title: string;
  summary?: string;
  /** Prominent titles sit above a card; compact titles live inside the card header row. */
  variant?: HeaderSectionVariant;
  action?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export type HeaderSectionProps = WithLoading<
  HeaderSectionContentProps,
  Pick<HeaderSectionContentProps, 'variant' | 'className' | 'style' | 'summary'>
>;

function HeaderSectionLoading({
  variant = 'compact',
  summary,
  className,
  style,
}: Pick<HeaderSectionContentProps, 'variant' | 'className' | 'style' | 'summary'>) {
  const isProminent = variant === 'prominent';
  const titleHeight = isProminent ? 28 : 20;
  const titleWidth = isProminent ? '52%' : '64%';

  return (
    <SkeletonShimmerProvider>
      <View
        className={cn('gap-sm', isProminent ? 'pb-sm' : 'pb-md', className)}
        style={style}
        accessibilityLabel="Cargando encabezado de sección"
      >
        <View className="flex-row items-start justify-between gap-sm">
          <View className="flex-1">
            <SkeletonBone width={titleWidth} height={titleHeight} borderRadius={Radius.xs} />
          </View>
        </View>
        {summary !== undefined ? (
          <SkeletonBone width="88%" height={14} />
        ) : (
          <SkeletonBone width="72%" height={14} />
        )}
      </View>
    </SkeletonShimmerProvider>
  );
}

/**
 * In-scroll section title block for card-based layouts (home, catalog sections, etc.).
 */
export function HeaderSection(props: HeaderSectionProps) {
  if (props.loading) {
    return (
      <HeaderSectionLoading
        variant={props.variant}
        summary={props.summary}
        className={props.className}
        style={props.style}
      />
    );
  }

  const { title, summary, variant = 'compact', action, className, style } = props;
  const isProminent = variant === 'prominent';

  return (
    <View className={cn('gap-sm', isProminent ? 'pb-sm' : 'pb-md', className)} style={style}>
      <View className="flex-row items-start justify-between gap-sm">
        <View className="flex-1">
          <TextHeading
            variant="section"
            themeColor={isProminent ? 'deepOcean' : undefined}
            className={cn('tracking-[-0.2px]', isProminent && typographyClassNames.brandSectionTitle)}
          >
            {title}
          </TextHeading>
        </View>
        {action}
      </View>
      {summary ? (
        <TextParagraph
          variant="secondary"
          themeColor="textSecondary"
          className="max-w-[620px] leading-[22px]"
        >
          {summary}
        </TextParagraph>
      ) : null}
    </View>
  );
}
