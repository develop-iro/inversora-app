import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import type { ProfileInconsistency } from '@/features/learn/services/build-educational-profile';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type LearnInconsistencyNoticeProps = {
  inconsistencies: readonly ProfileInconsistency[];
};

type GuidancePointProps = {
  text: string;
};

function GuidancePoint({ text }: GuidancePointProps) {
  const theme = useTheme();

  return (
    <View className="flex-row items-start gap-sm">
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={18}
        color={theme.warningBadgeLabel}
        // tailwind-exception: icon color from theme token
      />
      <TextParagraph variant="secondary" themeColor="textSecondary" className="flex-1 text-[16px] leading-6">
        {text}
      </TextParagraph>
    </View>
  );
}

/**
 * Orientative pause before the profile result when answers suggest a cautious profile.
 */
export function LearnInconsistencyNotice({ inconsistencies }: LearnInconsistencyNoticeProps) {
  const theme = useTheme();

  return (
    <View className="gap-lg">
      <View
        accessibilityRole="alert"
        className="gap-md rounded-card border border-warning-banner-border bg-warning-muted px-lg py-lg"
      >
        <View className="flex-row items-start gap-md">
          <View className="h-12 w-12 shrink-0 items-center justify-center rounded-full border border-warning-banner-border bg-warning-banner-surface">
            <MaterialCommunityIcons
              name="compass-outline"
              size={24}
              color={theme.warningBadgeLabel}
            />
          </View>
          <View className="min-w-0 flex-1 gap-xs">
            <TextLabel variant="meta" themeColor="warningBadgeLabel">
              Orientación de perfil
            </TextLabel>
            <TextHeading variant="section" className="text-[21px] leading-7 tracking-[-0.2px]">
              Tu perfil tiene matices importantes
            </TextHeading>
          </View>
        </View>

        <TextParagraph variant="secondary" themeColor="textSecondary" className="text-[17px] leading-7">
          No has respondido mal. Tus respuestas son válidas y nos ayudan a orientarte. Hemos
          detectado una combinación que suele pedir más prudencia: te lo explicamos antes de
          mostrarte tu perfil.
        </TextParagraph>
      </View>

      <View className="gap-sm">
        <TextLabel variant="meta" themeColor="deepOcean">
          Qué hemos identificado
        </TextLabel>
        {inconsistencies.map((item) => (
          <View
            key={item.id}
            className="gap-xs rounded-card border border-warning-banner-border bg-warning-banner-surface px-md py-md"
          >
            <TextParagraph variant="emphasis" className="text-[17px] leading-6">
              {item.title}
            </TextParagraph>
            <TextParagraph
              variant="secondary"
              themeColor="textSecondary"
              className="text-[16px] leading-[24px]"
            >
              {item.body}
            </TextParagraph>
          </View>
        ))}
      </View>

      <View className="gap-md rounded-card border border-border-subtle bg-surface px-md py-md shadow-card">
        <TextLabel variant="meta" themeColor="deepOcean">
          Si continúas ahora
        </TextLabel>
        <TextParagraph variant="emphasis" className="text-[17px] leading-6">
          Puedes guardar el perfil e ir al inicio, o ver un resumen antes de continuar
        </TextParagraph>
        <View className="gap-sm">
          <GuidancePoint text="Tu perfil se calculará con prudencia; no es un fallo del cuestionario." />
          <GuidancePoint text="Inversora priorizará explicaciones y filtros acordes a tu holgura financiera." />
          <GuidancePoint text="Puedes ajustar respuestas más tarde si tu situación cambia." />
        </View>
      </View>
    </View>
  );
}
