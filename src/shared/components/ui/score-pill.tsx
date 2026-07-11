import { View, type StyleProp, type ViewStyle } from 'react-native';

import { TextLabel } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

/** Shared sizing for score / return pills on fund cards. */
export const METRIC_PILL_MIN_HEIGHT = 52;

export type ScorePillProps = {
  score: number;
  /** En detalle el título de sección ya nombra el score; solo muestra la cifra. */
  variant?: 'default' | 'compact';
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function ScorePill({ score, variant = 'default', className, style }: ScorePillProps) {
  const isCompact = variant === 'compact';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Score Inversora ${score} sobre 100`}
      className={cn(
        'min-h-[52px] items-center justify-center gap-half self-start rounded-pill border border-border bg-surface-muted px-md py-sm',
        isCompact && 'px-md py-sm',
        className,
      )}
      style={style}
    >
      {!isCompact ? (
        <TextLabel variant="meta" themeColor="textSecondary" className="tracking-[1px]">
          Score Inversora
        </TextLabel>
      ) : null}
      <TextLabel
        variant="chip"
        themeColor="deepOcean"
        className={isCompact ? 'font-display-bold text-scoreHeroCompact' : 'font-display-bold text-scoreHero'}
      >
        {score}/100
      </TextLabel>
    </View>
  );
}
