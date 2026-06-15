/**
 * RN-04 scoring weights for UI mock — aligned with product rules and ADR-002.
 * Production calculation runs on inversora-api (`rn-04`); this is dev-only.
 */
export const SCORING_CRITERIA_VERSION = 'rn-04-mock';

export const SCORING_CRITERIA = {
  ter: { weight: 0.4, label: 'Comisión (TER)' },
  tracking: { weight: 0.4, label: 'Tracking error' },
  aum: { weight: 0.1, label: 'Patrimonio (AUM)' },
  age: { weight: 0.1, label: 'Antigüedad del fondo' },
} as const;
