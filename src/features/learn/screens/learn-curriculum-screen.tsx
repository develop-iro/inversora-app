import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  LEARN_CURRICULUM_LESSONS,
  LEARN_CURRICULUM_MODULES,
  LEARN_CURRICULUM_TOTAL_LESSONS,
} from '@/features/learn/constants/learn-curriculum';
import type { LearnLesson } from '@/features/learn/entities/learn-curriculum.schema';
import { LearnConceptCardList } from '@/features/learn/components/learn-concept-card-list';
import type { LearnConceptCard } from '@/features/learn/constants/learn-questionnaire';
import { LearnProgressHeader } from '@/features/learn/components/learn-progress-header';
import { useLearnCurriculumProgress } from '@/features/learn/hooks/use-learn-curriculum-progress';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { TabScreenScroll } from '@/shared/components/layout';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui';
import { routes } from '@/shared/navigation/routes';
import { Layout, MaxContentWidth, Spacing } from '@/shared/theme/theme';
import { useTheme } from '@/shared/hooks/use-theme';

function mapConceptCards(
  cards: LearnLesson['conceptCards'],
): readonly LearnConceptCard[] | undefined {
  if (cards === undefined) {
    return undefined;
  }

  return cards.map((card) => ({
    id: card.id,
    title: card.title,
    description: card.description,
    icon: card.icon as LearnConceptCard['icon'],
  }));
}

/**
 * Beginner curriculum tab: structured lessons with local progress tracking.
 */
export default function LearnCurriculumScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { progress, isLoading, markLessonCompleted, isLessonCompleted } =
    useLearnCurriculumProgress();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const completedCount = progress?.completedLessonIds.length ?? 0;
  const activeLesson =
    activeLessonId !== null ? LEARN_CURRICULUM_LESSONS[activeLessonId] : undefined;

  const moduleSummaries = useMemo(
    () =>
      LEARN_CURRICULUM_MODULES.map((module) => {
        const completedInModule = module.lessonIds.filter((id) => isLessonCompleted(id)).length;

        return {
          module,
          completedInModule,
          totalInModule: module.lessonIds.length,
        };
      }),
    [isLessonCompleted],
  );

  const handleOpenLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveLessonId(null);
  }, []);

  const handleCompleteLesson = useCallback(async () => {
    if (activeLesson === undefined) {
      return;
    }

    await markLessonCompleted(activeLesson.id);
    setActiveLessonId(null);
  }, [activeLesson, markLessonCompleted]);

  const handleLessonLink = useCallback(() => {
    if (activeLesson?.link === undefined) {
      return;
    }

    if (activeLesson.link.type === 'questionnaire') {
      router.push(routes.learn);
      return;
    }

    if (activeLesson.link.href !== undefined) {
      router.push(activeLesson.link.href as typeof routes.calculator);
    }
  }, [activeLesson, router]);

  if (activeLesson !== undefined) {
    const conceptCards = mapConceptCards(activeLesson.conceptCards);
    const alreadyCompleted = isLessonCompleted(activeLesson.id);

    return (
      <TabScreenScroll
        extraBottomPadding={Spacing.xl}
        contentContainerClassName="items-center pt-xl"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full gap-lg"
          style={{
            maxWidth: MaxContentWidth,
            paddingHorizontal: Layout.screenPaddingHorizontal,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al listado de lecciones"
            onPress={handleBackToList}
            className="flex-row items-center gap-xs self-start active:opacity-75"
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={theme.primary} />
            <TextParagraph variant="emphasis" themeColor="primary">
              Lecciones
            </TextParagraph>
          </Pressable>

          {activeLesson.eyebrow ? (
            <TextLabel variant="meta" themeColor="deepOcean">
              {activeLesson.eyebrow}
            </TextLabel>
          ) : null}

          <TextHeading variant="hero">{activeLesson.title}</TextHeading>

          <TextParagraph variant="secondary" themeColor="textSecondary" className="text-[17px] leading-7">
            {activeLesson.body}
          </TextParagraph>

          {conceptCards !== undefined && conceptCards.length > 0 ? (
            <LearnConceptCardList cards={conceptCards} />
          ) : null}

          {activeLesson.link !== undefined ? (
            <Button variant="secondary" label={activeLesson.link.label} onPress={handleLessonLink} />
          ) : null}

          {!alreadyCompleted ? (
            <Button variant="primary" label="Marcar como completada" onPress={handleCompleteLesson} />
          ) : (
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Lección completada
            </TextParagraph>
          )}

          <LegalNotice body="Contenido educativo orientativo. No sustituye asesoramiento personalizado." />
        </View>
      </TabScreenScroll>
    );
  }

  return (
    <TabScreenScroll
      extraBottomPadding={Spacing.xl}
      contentContainerClassName="items-center pt-xl"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="w-full gap-lg"
        style={{
          maxWidth: MaxContentWidth,
          paddingHorizontal: Layout.screenPaddingHorizontal,
        }}
      >
        <View className="gap-sm">
          <TextHeading variant="hero">Aprendizaje</TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            Mini-curriculum para entender conceptos clave antes de comparar fondos indexados.
          </TextParagraph>
        </View>

        {!isLoading ? (
          <LearnProgressHeader
            currentStep={completedCount}
            totalSteps={LEARN_CURRICULUM_TOTAL_LESSONS}
          />
        ) : null}

        {moduleSummaries.map(({ module, completedInModule, totalInModule }) => (
          <View key={module.id} className="gap-md">
            <View className="gap-xs">
              <TextHeading variant="section">{module.title}</TextHeading>
              <TextParagraph variant="secondary" themeColor="textSecondary">
                {module.description} · {completedInModule}/{totalInModule} completadas
              </TextParagraph>
            </View>

            <View className="gap-sm">
              {module.lessonIds.map((lessonId) => {
                const lesson = LEARN_CURRICULUM_LESSONS[lessonId];
                const completed = isLessonCompleted(lessonId);

                return (
                  <Pressable
                    key={lessonId}
                    accessibilityRole="button"
                    accessibilityLabel={`${lesson.title}. ${completed ? 'Completada' : 'Pendiente'}`}
                    onPress={() => handleOpenLesson(lessonId)}
                    className="flex-row items-center gap-md rounded-card border border-border-subtle bg-surface px-md py-md active:opacity-90"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-background-soft">
                      <MaterialCommunityIcons
                        name={completed ? 'check-circle' : 'book-open-page-variant-outline'}
                        size={20}
                        color={completed ? theme.success : theme.deepOcean}
                      />
                    </View>
                    <View className="min-w-0 flex-1 gap-xs">
                      <TextParagraph variant="emphasis">{lesson.title}</TextParagraph>
                      <TextParagraph variant="secondary" themeColor="textSecondary">
                        ~{lesson.estimatedMinutes} min
                      </TextParagraph>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondary} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <LegalNotice body="El progreso se guarda solo en este dispositivo. No implica recomendación de inversión." />
      </View>
    </TabScreenScroll>
  );
}
