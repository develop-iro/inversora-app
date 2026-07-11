import { Text, View } from 'react-native';

import { InversoraBrandMark } from '@/shared/components/brand/inversora-brand-mark';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import { Size } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

const COMPACT_HEADER_WIDTH = 400;

/**
 * Brand cluster for dashboard (`HeaderApp`) surfaces.
 */
export function HeaderBrand() {
  const { windowWidth, isMobile } = useMobileLayout();
  const isCompact = windowWidth < COMPACT_HEADER_WIDTH;

  return (
    <View className="min-w-0 flex-1 shrink flex-row items-center gap-sm">
      <InversoraBrandMark size={isCompact ? Size.iconLg : Size.iconBrand} />

      <View className="shrink-0 gap-[1px]">
        <Text
          className={cn(
            isCompact ? typographyClassNames.brandWordmarkCompact : typographyClassNames.brandWordmark,
            'text-deep-ocean',
          )}
          accessibilityRole="header"
        >
          Inversora
        </Text>
        {!isMobile ? (
          <Text className={cn(typographyClassNames.micro, 'text-text-secondary')} numberOfLines={1}>
            Educación financiera
          </Text>
        ) : null}
      </View>
    </View>
  );
}
