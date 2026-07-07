import type { SectionCardProps } from '@/shared/components/layout/section-card';
import { SectionCard } from '@/shared/components/layout/section-card';

export type HomeSectionCardProps = SectionCardProps;

/**
 * Card-based section wrapper for the home scroll surface.
 * Replaces line dividers with elevated white cards on the neutral background.
 */
export function HomeSectionCard({
  className,
  contentClassName,
  style,
  headerPlacement = 'above',
  ...props
}: HomeSectionCardProps) {
  const layoutClassName = ['px-lg', className].filter(Boolean).join(' ');

  return (
    <SectionCard
      {...props}
      headerPlacement={headerPlacement}
      headerVariant={headerPlacement === 'above' ? 'prominent' : 'compact'}
      className={layoutClassName}
      contentClassName={contentClassName}
      style={style}
    />
  );
}
