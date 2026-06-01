/** Versioned scoring weights — production values will live on the backend. */
export const SCORING_CRITERIA_VERSION = 'mvp-mock-1';

export const SCORING_CRITERIA = {
  ter: { weight: 0.3, label: 'Comisión (TER)' },
  tracking: { weight: 0.2, label: 'Tracking error' },
  aum: { weight: 0.15, label: 'Patrimonio (AUM)' },
  age: { weight: 0.1, label: 'Antigüedad del fondo' },
  consistency: { weight: 0.15, label: 'Consistencia histórica' },
  dataQuality: { weight: 0.1, label: 'Calidad de datos' },
} as const;
