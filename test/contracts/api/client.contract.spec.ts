import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveSafeApiErrorMessage } from '@/core/api/api-error-message';

describe('resolveSafeApiErrorMessage', () => {
  it('maps common API statuses to safe user-facing messages', () => {
    assert.equal(
      resolveSafeApiErrorMessage(400),
      'La peticion no es valida. Revisa los datos e intentalo de nuevo.',
    );
    assert.equal(
      resolveSafeApiErrorMessage(403),
      'No se pudo autorizar la peticion de forma segura.',
    );
    assert.equal(
      resolveSafeApiErrorMessage(404),
      'El recurso solicitado no esta disponible.',
    );
    assert.equal(
      resolveSafeApiErrorMessage(429),
      'Se han realizado demasiadas peticiones. Espera un momento antes de continuar.',
    );
    assert.equal(
      resolveSafeApiErrorMessage(503),
      'La API no esta disponible temporalmente. Intentalo de nuevo en unos minutos.',
    );
  });

  it('uses a generic fallback for unexpected statuses', () => {
    assert.equal(
      resolveSafeApiErrorMessage(418),
      'No se pudo completar la peticion de forma segura. Intentalo de nuevo.',
    );
  });
});
