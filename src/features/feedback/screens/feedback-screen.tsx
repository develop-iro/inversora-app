import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppError } from '@/core/errors/app-error';
import { FeedbackOptionGroup } from '@/features/feedback/components/feedback-option-group';
import {
  FEEDBACK_CLARITY_OPTIONS,
  FEEDBACK_WOULD_RETURN_OPTIONS,
  productFeedbackInputSchema,
  type FeedbackClarity,
  type FeedbackWouldReturn,
} from '@/features/feedback/schemas/product-feedback.schema';
import { submitProductFeedback } from '@/features/feedback/services/submit-product-feedback';
import { ScreenShell } from '@/shared/components/layout/screen-shell';
import { Header } from '@/shared/components/headers';
import { InputField } from '@/shared/components/inputs/input-field';
import { TextHeading, TextLegal, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useToast } from '@/shared/hooks/use-toast';
import { Layout, Spacing } from '@/shared/theme/theme';

/**
 * Anonymous product feedback form for MVP validation.
 */
export default function FeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { contentWidth } = useMobileLayout();
  const toast = useToast();

  const [clarity, setClarity] = useState<FeedbackClarity | null>(null);
  const [wouldReturn, setWouldReturn] = useState<FeedbackWouldReturn | null>(null);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const parsed = productFeedbackInputSchema.safeParse({
      clarity: clarity ?? undefined,
      wouldReturn: wouldReturn ?? undefined,
      message,
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Completa las preguntas obligatorias.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await submitProductFeedback({
        clarity: parsed.data.clarity,
        wouldReturn: parsed.data.wouldReturn,
        message: parsed.data.message,
        surface: 'feedback',
      });

      toast.success('Gracias por tu opinión. Nos ayuda a mejorar Inversora.');
      router.back();
    } catch (error) {
      const fallback = 'No se pudo enviar tu opinión. Inténtalo de nuevo en unos minutos.';
      const messageText =
        error instanceof AppError && error.message.trim().length > 0
          ? error.message
          : fallback;

      toast.error(messageText);
    } finally {
      setIsSubmitting(false);
    }
  }, [clarity, message, router, toast, wouldReturn]);

  return (
    <ScreenShell
      header={
        <Header
          title="Tu opinión"
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
            <TextHeading variant="section">Ayúdanos a mejorar</TextHeading>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Tu opinión es anónima. No pedimos nombre, correo ni teléfono. La usamos solo para
              entender qué funciona y qué debemos aclarar en el MVP.
            </TextParagraph>
          </View>

          <Card variant="outlined" contentClassName="gap-lg">
            <FeedbackOptionGroup
              label="¿Te resultó clara la experiencia?"
              options={FEEDBACK_CLARITY_OPTIONS}
              value={clarity}
              onChange={setClarity}
            />

            <FeedbackOptionGroup
              label="¿Volverías a usar Inversora?"
              options={FEEDBACK_WOULD_RETURN_OPTIONS}
              value={wouldReturn}
              onChange={setWouldReturn}
            />

            <InputField
              label="¿Qué mejorarías? (opcional)"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={2000}
              placeholder="Cuéntanos qué fue confuso, qué echaste en falta o qué te gustó."
              accessibilityLabel="Comentario opcional sobre la experiencia"
            />

            {formError ? (
              <TextLegal themeColor="warningBadgeLabel">{formError}</TextLegal>
            ) : null}

            <Button
              label={isSubmitting ? 'Enviando…' : 'Enviar opinión'}
              onPress={() => {
                void handleSubmit();
              }}
              disabled={isSubmitting}
              accessibilityLabel="Enviar opinión anónima"
            />
          </Card>

          <TextLegal themeColor="textSecondary">
            No incluyas datos personales en tu comentario. Si necesitas ejercer derechos de
            privacidad, usa el contacto de la política de privacidad.
          </TextLegal>
        </ScrollView>
      }
    />
  );
}
