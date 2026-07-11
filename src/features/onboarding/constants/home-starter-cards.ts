/** Visual variants for the home "Para empezar" entry cards. */
export type HomeStarterCardVariant = 'learn' | 'ranking';

/** Screen-reader labels for decorative starter-card illustrations. */
export const HOME_STARTER_CARD_ILLUSTRATION_LABELS = {
  learn:
    'Ilustración animada de un libro abierto con gráfico suave, simbolizando conceptos básicos',
  ranking:
    'Ilustración animada de barras en podium con estrella, simbolizando un ranking educativo observacional',
} as const satisfies Record<HomeStarterCardVariant, string>;
