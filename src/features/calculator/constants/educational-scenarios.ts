/** Preset educational rate scenario for compound interest simulations (HU-30). */
export type EducationalRateScenario = 'prudent' | 'moderate' | 'optimistic' | 'custom';

export type EducationalScenarioPreset = {
  readonly id: EducationalRateScenario;
  readonly label: string;
  readonly annualRatePercent: number;
  readonly description: string;
};

/** Illustrative annual rates for beginner-friendly scenarios. */
export const EDUCATIONAL_RATE_SCENARIOS: readonly EducationalScenarioPreset[] = [
  {
    id: 'prudent',
    label: 'Prudente',
    annualRatePercent: 3,
    description: 'Escenario conservador para entender el efecto del ahorro constante.',
  },
  {
    id: 'moderate',
    label: 'Medio',
    annualRatePercent: 5,
    description: 'Referencia equilibrada solo con fines educativos.',
  },
  {
    id: 'optimistic',
    label: 'Optimista',
    annualRatePercent: 7,
    description: 'Escenario favorable; no implica que vaya a ocurrir.',
  },
] as const;

/**
 * Resolves the preset matching a given annual rate, if any.
 *
 * @param annualRatePercent - Current annual rate in the form.
 */
export function matchEducationalScenario(
  annualRatePercent: number,
): EducationalRateScenario {
  const match = EDUCATIONAL_RATE_SCENARIOS.find(
    (scenario) => scenario.annualRatePercent === annualRatePercent,
  );

  return match?.id ?? 'custom';
}
