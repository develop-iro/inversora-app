import { z } from 'zod';

/** Deep link action from a curriculum lesson. */
export const learnLessonLinkSchema = z.object({
  type: z.enum(['route', 'questionnaire']),
  label: z.string().min(1),
  href: z.string().min(1).optional(),
});

export type LearnLessonLink = z.infer<typeof learnLessonLinkSchema>;

/** Concept card embedded in a lesson body. */
export const learnLessonConceptCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export type LearnLessonConceptCard = z.infer<typeof learnLessonConceptCardSchema>;

/** Single educational lesson within a module. */
export const learnLessonSchema = z.object({
  id: z.string().min(1),
  moduleId: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  eyebrow: z.string().min(1).optional(),
  estimatedMinutes: z.number().int().positive(),
  conceptCards: z.array(learnLessonConceptCardSchema).optional(),
  link: learnLessonLinkSchema.optional(),
});

export type LearnLesson = z.infer<typeof learnLessonSchema>;

/** Group of related lessons in the beginner curriculum. */
export const learnModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  lessonIds: z.array(z.string().min(1)).min(1),
});

export type LearnModule = z.infer<typeof learnModuleSchema>;

/** Local progress for the educational curriculum tab. */
export const curriculumProgressSchema = z.object({
  completedLessonIds: z.array(z.string().min(1)),
  lastLessonId: z.string().min(1).optional(),
  updatedAt: z.string().datetime(),
});

export type CurriculumProgress = z.infer<typeof curriculumProgressSchema>;

/** Secondary tab mode for the favorites slot. */
export const secondaryTabModeSchema = z.enum(['learn', 'favorites']);

export type SecondaryTabMode = z.infer<typeof secondaryTabModeSchema>;
