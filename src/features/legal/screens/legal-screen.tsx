import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LEGAL_SECTIONS } from '@/features/legal/constants/legal-sections';
import { CollapsibleSection } from '@/shared/components/layout';
import { ScreenShell } from '@/shared/components/layout/screen-shell';
import { Header } from '@/shared/components/headers';
import { TextHeading, TextLegal, TextParagraph } from '@/shared/components/text';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { Layout, Spacing } from '@/shared/theme/theme';

/**
 * Centralized legal and educational disclaimers for the MVP.
 */
export default function LegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { contentWidth } = useMobileLayout();

  return (
    <ScreenShell
      header={
        <Header
          title="Información legal"
          leadingActions={['back']}
          onAction={{
            back: () => router.back(),
          }}
        />
      }
      body={
        <ScrollView
          className="min-h-0 w-full flex-1 bg-background"
          contentContainerClassName="gap-lg self-center pt-lg"
          contentContainerStyle={{
            width: contentWidth,
            maxWidth: contentWidth,
            paddingHorizontal: Layout.screenPaddingHorizontal,
            paddingBottom: insets.bottom + Spacing['3xl'],
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-sm">
            <TextHeading variant="section">Avisos legales</TextHeading>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Textos de referencia para el uso educativo de Inversora. No sustituyen el
              asesoramiento de un profesional cualificado ni la documentación oficial de
              cada fondo.
            </TextParagraph>
          </View>

          <View className="gap-md">
            {LEGAL_SECTIONS.map((section, index) => (
              <CollapsibleSection
                key={section.id}
                title={section.title}
                defaultExpanded={index === 0}
              >
                <TextLegal themeColor="textSecondary">{section.body}</TextLegal>
              </CollapsibleSection>
            ))}
          </View>

          <TextLegal themeColor="textSecondary" className="pt-sm">
            Última revisión: junio 2026. Inversora MVP — uso informativo y educativo.
          </TextLegal>
        </ScrollView>
      }
    />
  );
}
