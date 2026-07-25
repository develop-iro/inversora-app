import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { modal } from '@/core/overlay/modal';
import { openSafeExternalUrl } from '@/core/security/open-safe-external-url';
import { getDataDeletionUrl } from '@/features/legal/constants/data-deletion-url';
import { LEGAL_SECTIONS } from '@/features/legal/constants/legal-sections';
import { getPrivacyPolicyUrl } from '@/features/legal/constants/privacy-policy-url';
import { requestDataDeletion } from '@/features/legal/services/request-data-deletion';
import { CollapsibleSection } from '@/shared/components/layout';
import { ScreenShell } from '@/shared/components/layout/screen-shell';
import { Header } from '@/shared/components/headers';
import { TextHeading, TextLegal, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { routes } from '@/shared/navigation/routes';
import { Layout, Spacing } from '@/shared/theme/theme';

/**
 * Centralized legal and educational disclaimers for the MVP.
 */
export default function LegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { contentWidth } = useMobileLayout();
  const privacyPolicyUrl = getPrivacyPolicyUrl();
  const dataDeletionUrl = getDataDeletionUrl();
  const [isDeletingData, setIsDeletingData] = useState(false);

  const handleOpenPrivacyPolicy = useCallback(() => {
    void openSafeExternalUrl(privacyPolicyUrl);
  }, [privacyPolicyUrl]);

  const handleOpenDataDeletionPage = useCallback(() => {
    void openSafeExternalUrl(dataDeletionUrl);
  }, [dataDeletionUrl]);

  const handleOpenFeedback = useCallback(() => {
    router.push(routes.feedback);
  }, [router]);

  const handleRequestDataDeletion = useCallback(() => {
    void (async () => {
      const confirmed = await modal.confirm(
        'Eliminar mis datos',
        'Se borrarán el perfil educativo, favoritos, analytics anónimos y conversaciones SORA ligadas a esta instalación. Esta acción no se puede deshacer.',
        {
          confirmLabel: 'Eliminar datos',
          cancelLabel: 'Cancelar',
          destructive: true,
        },
      );

      if (!confirmed) {
        return;
      }

      setIsDeletingData(true);

      try {
        await requestDataDeletion();
        modal.alert(
          'Datos eliminados',
          'Hemos borrado los datos de esta instalación en el servidor y en el dispositivo. Puedes seguir usando la app; se creará una identidad anónima nueva si es necesario.',
        );
        router.replace(routes.home);
      } catch {
        modal.alert(
          'No se pudieron eliminar los datos',
          'Comprueba la conexión e inténtalo de nuevo. No hemos borrado los datos locales para evitar dejar el servidor desincronizado.',
        );
      } finally {
        setIsDeletingData(false);
      }
    })();
  }, [router]);

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
            <Button
              label="Enviar opinión"
              variant="outline"
              onPress={handleOpenFeedback}
              accessibilityLabel="Abrir formulario de opinión anónima"
            />

            <Button
              label="Eliminar mis datos"
              variant="outline"
              onPress={handleRequestDataDeletion}
              loading={isDeletingData}
              accessibilityLabel="Solicitar eliminación de datos de esta instalación"
            />

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

            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Abrir instrucciones de eliminación de datos"
              onPress={handleOpenDataDeletionPage}
              className="self-start active:opacity-75"
            >
              <TextLegal themeColor="primary" className="underline">
                Cómo eliminar tus datos
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
