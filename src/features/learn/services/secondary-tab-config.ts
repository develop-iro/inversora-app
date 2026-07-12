import type { EducationalProfile } from '@/core/domain/educational-profile';
import type { SecondaryTabMode } from '@/features/learn/entities/learn-curriculum.schema';
import { shouldApplyBeginnerSurfaceGuards } from '@/features/funds/utils/beginner-eligibility';

export type SecondaryTabConfig = {
  readonly mode: SecondaryTabMode;
  readonly label: string;
  readonly accessibilityLabel: string;
  readonly activeIcon: 'book-open-page-variant' | 'heart';
  readonly inactiveIcon: 'book-open-page-variant-outline' | 'heart-outline';
};

/**
 * Resolves whether the favorites tab slot shows Aprendizaje or Favoritos.
 *
 * @param profile - Current educational profile, if any.
 */
export function resolveSecondaryTabMode(
  profile: Pick<EducationalProfile, 'knowledgeLevel'> | null | undefined,
): SecondaryTabMode {
  return shouldApplyBeginnerSurfaceGuards(profile) ? 'learn' : 'favorites';
}

/**
 * Tab bar labels and icons for the secondary tab slot.
 *
 * @param mode - Resolved secondary tab mode.
 */
export function resolveSecondaryTabConfig(mode: SecondaryTabMode): SecondaryTabConfig {
  if (mode === 'learn') {
    return {
      mode,
      label: 'Aprendizaje',
      accessibilityLabel: 'Abrir aprendizaje',
      activeIcon: 'book-open-page-variant',
      inactiveIcon: 'book-open-page-variant-outline',
    };
  }

  return {
    mode,
    label: 'Favoritos',
    accessibilityLabel: 'Ver favoritos',
    activeIcon: 'heart',
    inactiveIcon: 'heart-outline',
  };
}
