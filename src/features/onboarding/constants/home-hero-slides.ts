import type { ImageSourcePropType } from 'react-native';

export type HomeHeroSlideAction = 'learn' | 'funds' | 'compare';

export type HomeHeroSlide = {
  readonly id: string;
  readonly headline: string;
  readonly subtitle: string;
  readonly ctaLabel: string;
  readonly action: HomeHeroSlideAction;
  /** Wide banner illustration shown at the top of the slide card. */
  readonly illustration: ImageSourcePropType;
  /** Short description for screen readers (decorative image context). */
  readonly illustrationLabel: string;
};

const heroSlideLearn = require('../../../../assets/images/hero-slide-learn.png');
const heroSlideCompare = require('../../../../assets/images/hero-slide-compare.png');
const heroSlideCalm = require('../../../../assets/images/hero-slide-calm.png');

/**
 * Educational hero slides for the home carousel.
 * Each slide pairs copy with a brand-aligned illustration strip.
 */
export const HOME_HERO_SLIDES: readonly HomeHeroSlide[] = [
  {
    id: 'learn-first',
    headline: 'Entiende antes de comparar',
    subtitle: 'Aprende sobre fondos indexados sin prisa',
    ctaLabel: 'Quiero aprender',
    action: 'learn',
    illustration: heroSlideLearn,
    illustrationLabel:
      'Ilustración de un libro abierto con gráfico de crecimiento suave, simbolizando aprendizaje',
  },
  {
    id: 'clear-criteria',
    headline: 'Compara con criterios claros',
    subtitle: 'TER, tracking error y Score Inversora explicados',
    ctaLabel: 'Explorar fondos',
    action: 'funds',
    illustration: heroSlideCompare,
    illustrationLabel:
      'Ilustración de dos gráficos de barras y una balanza, simbolizando comparación equilibrada',
  },
  {
    id: 'calm-decisions',
    headline: 'Decide con calma',
    subtitle: 'Sin prisa, sin recomendaciones personalizadas',
    ctaLabel: 'Ver comparador',
    action: 'compare',
    illustration: heroSlideCalm,
    illustrationLabel:
      'Ilustración de un camino ascendente suave con reloj de arena, simbolizando decisiones pausadas',
  },
] as const;
