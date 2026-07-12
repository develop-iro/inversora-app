import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { openSafeExternalUrl } from '@/core/security/open-safe-external-url';
import { LEGAL_SECTIONS } from '@/features/legal/constants/legal-sections';
import { getPrivacyPolicyUrl } from '@/features/legal/constants/privacy-policy-url';
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
  const privacyPolicyUrl = getPrivacyPolicyUrl();

  const handleOpenPrivacyPolicy = useCallback(() => {
    void openSafeExternalUrl(privacyPolicyUrl);
  }, [privacyPolicyUrl]);

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

          <View className="gap-sm pt-sm">
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Abrir política de privacidad completa"
              onPress={handleOpenPrivacyPolicy}
              className="self-start active:opacity-75"
            >
              <TextLegal themeColor="primary" className="underline">
                Política de privacidad completa
              </TextLegal>
            </Pressable>

            <TextLegal themeColor="textSecondary" className="text-xs">
              {privacyPolicyUrl}
            </TextLegal>

            <TextLegal themeColor="textSecondary">
              Última revisión: julio 2026. Inversora MVP — uso informativo y educativo.
            </TextLegal>
          </View>
        </ScrollView>
      }
    />
  );
}
