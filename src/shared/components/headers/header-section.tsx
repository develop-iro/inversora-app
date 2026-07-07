import type { ReactNode } from 'react';

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';



import { TextHeading } from '@/shared/components/text/text-heading';

import { TextParagraph } from '@/shared/components/text/text-paragraph';

import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonShimmerProvider } from '@/shared/components/ui/skeleton-shimmer-provider';

import { Layout, Radius, Spacing, Typography } from '@/shared/theme/theme';

import type { WithLoading } from '@/shared/types/component-loading';



export type HeaderSectionVariant = 'prominent' | 'compact';



type HeaderSectionContentProps = {

  title: string;

  summary?: string;

  /** Prominent titles sit above a card; compact titles live inside the card header row. */

  variant?: HeaderSectionVariant;

  action?: ReactNode;

  style?: StyleProp<ViewStyle>;

};



export type HeaderSectionProps = WithLoading<

  HeaderSectionContentProps,

  Pick<HeaderSectionContentProps, 'variant' | 'style' | 'summary'>

>;



function HeaderSectionLoading({

  variant = 'compact',

  summary,

  style,

}: Pick<HeaderSectionContentProps, 'variant' | 'style' | 'summary'>) {

  const isProminent = variant === 'prominent';

  const titleHeight = isProminent ? 28 : 20;

  const titleWidth = isProminent ? '52%' : '64%';



  return (
    <SkeletonShimmerProvider>
      <View
        style={[styles.header, isProminent ? styles.headerProminent : styles.headerCompact, style]}
        accessibilityLabel="Cargando encabezado de sección"
      >
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
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

        style={props.style}

      />

    );

  }



  const { title, summary, variant = 'compact', action, style } = props;

  const isProminent = variant === 'prominent';



  return (

    <View style={[styles.header, isProminent ? styles.headerProminent : styles.headerCompact, style]}>

      <View style={styles.titleRow}>

        <View style={styles.titleBlock}>

          <TextHeading

            variant="section"

            themeColor={isProminent ? 'deepOcean' : undefined}

            style={[styles.title, isProminent && styles.titleProminent]}

          >

            {title}

          </TextHeading>

        </View>

        {action}

      </View>

      {summary ? (

        <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.summary}>

          {summary}

        </TextParagraph>

      ) : null}

    </View>

  );

}



const styles = StyleSheet.create({

  header: {

    gap: Spacing.sm,

  },

  headerProminent: {

    paddingBottom: Spacing.sm,

  },

  headerCompact: {

    paddingBottom: Spacing.md,

  },

  titleRow: {

    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    gap: Spacing.sm,

  },

  titleBlock: {

    flex: 1,

  },

  title: {

    letterSpacing: -0.2,

  },

  titleProminent: {

    ...Typography.brandSectionTitle,

  },

  summary: {

    maxWidth: Layout.contentSummaryMaxWidth,

    lineHeight: Typography.navTitle.lineHeight,

  },

});

