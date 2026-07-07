import { HomeHeroSlideCard } from '@/features/onboarding/components/home-hero-slide-card';
import {
  HOME_HERO_SLIDES,
  type HomeHeroSlide,
  type HomeHeroSlideAction,
} from '@/features/onboarding/constants/home-hero-slides';
import { CarouselShell } from '@/shared/components/carousels';

export type HomeHeroCarouselProps = {
  onSlideAction?: (action: HomeHeroSlideAction) => void;
};

/**
 * Auto-advancing hero carousel for the minimal home layout.
 */
export function HomeHeroCarousel({ onSlideAction }: HomeHeroCarouselProps) {
  const slides = HOME_HERO_SLIDES;

  return (
    <CarouselShell<HomeHeroSlide>
      data={slides}
      keyExtractor={(item) => item.id}
      autoplayMs={5500}
      wrapperClassName="px-lg pt-lg"
      accessibilityLabel={(index, count) =>
        `Mensaje educativo ${index + 1} de ${count}`
      }
      accessibilityHint="Desliza horizontalmente para ver más mensajes"
      showControls={false}
      showDots
      animateDots
      renderSlide={(item) => (
        <HomeHeroSlideCard
          slide={item}
          onCtaPress={() => {
            onSlideAction?.(item.action);
          }}
        />
      )}
    />
  );
}
