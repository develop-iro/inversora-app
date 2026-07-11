import type { AssistantSurface } from '@/features/assistant/types/assistant-context';

/** Human-readable label for an assistant surface. */
export function resolveSoraSurfaceLabel(surface: AssistantSurface): string {
  switch (surface) {
    case 'home':
      return 'Inicio';
    case 'fund-detail':
      return 'Ficha de fondo';
    case 'catalog':
      return 'Catálogo';
    case 'ranking':
      return 'Ranking';
    case 'compare':
      return 'Comparación';
    default: {
      const _exhaustive: never = surface;
      return _exhaustive;
    }
  }
}

/** Default educational prompts when a surface does not supply its own. */
export function resolveSoraDefaultPrompts(surface: AssistantSurface): readonly string[] {
  switch (surface) {
    case 'home':
      return [
        '¿Qué es un fondo indexado?',
        '¿Cómo funciona el Inversora Score?',
        '¿Qué significa el TER?',
      ];
    case 'fund-detail':
      return [
        '¿Por qué este fondo tiene este score?',
        '¿Qué significa el tracking error aquí?',
        'Explícame el benchmark de este fondo',
      ];
    case 'catalog':
      return [
        '¿Cómo filtrar fondos por categoría?',
        '¿Qué diferencia hay entre categorías?',
        '¿Qué mirar al comparar TER?',
      ];
    case 'ranking':
      return [
        '¿Por qué este fondo está arriba?',
        '¿Qué criterios usa el ranking?',
        '¿El score garantiza rentabilidad?',
      ];
    case 'compare':
      return [
        'Resume las diferencias principales',
        '¿Cuál tiene menor TER y qué implica?',
        'Explica las diferencias educativas entre estos fondos',
      ];
    default: {
      const _exhaustive: never = surface;
      return _exhaustive;
    }
  }
}

/** Context chips shown above the composer (surface + optional fund ISINs). */
export function resolveSoraContextChips(
  surface: AssistantSurface,
  fundIsin: string | undefined,
  fundIsins: readonly string[] | undefined,
): readonly string[] {
  const merged = [
    ...(fundIsins ?? []),
    ...(fundIsin ? [fundIsin] : []),
  ]
    .map((isin) => isin.trim().toUpperCase())
    .filter((isin) => isin.length > 0);

  const uniqueFunds = [...new Set(merged)];
  const chips = [resolveSoraSurfaceLabel(surface)];

  if (uniqueFunds.length === 1) {
    chips.push(uniqueFunds[0]);
  } else if (uniqueFunds.length > 1) {
    chips.push(`${uniqueFunds.length} fondos`);
  }

  return chips;
}
