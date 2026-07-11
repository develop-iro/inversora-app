import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type CollapsibleSectionProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly defaultExpanded?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
};

/**
 * Progressive-disclosure block for long or secondary content on detail screens.
 */
export function CollapsibleSection({
  title,
  subtitle,
  defaultExpanded = false,
  children,
  className,
}: CollapsibleSectionProps) {
  const theme = useTheme(); // tailwind-exception: chevron icon color
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View className={cn('overflow-hidden rounded-card border border-border bg-surface', className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${title}. ${isExpanded ? 'Contraer' : 'Expandir'} sección`}
        onPress={() => setIsExpanded((current) => !current)}
        className="flex-row items-center justify-between gap-sm px-md py-md active:opacity-90"
      >
        <View className="flex-1 gap-xs">
          <TextParagraph variant="emphasis">{title}</TextParagraph>
          {subtitle ? (
            <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={2}>
              {subtitle}
            </TextParagraph>
          ) : null}
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={theme.textSecondary}
        />
      </Pressable>

      {isExpanded ? <View className="gap-md px-md pb-md">{children}</View> : null}
    </View>
  );
}
