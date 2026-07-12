export function resolveSafeApiErrorMessage(status: number): string {
  if (status === 400) {
    return 'La peticion no es valida. Revisa los datos e intentalo de nuevo.';
  }

  if (status === 401 || status === 403) {
    return 'No se pudo autorizar la peticion de forma segura.';
  }

  if (status === 404) {
    return 'El recurso solicitado no esta disponible.';
  }

  if (status === 429) {
    return 'Se han realizado demasiadas peticiones. Espera un momento antes de continuar.';
  }

  if (status === 503) {
    return 'La API no esta disponible temporalmente. Intentalo de nuevo en unos minutos.';
  }

  return 'No se pudo completar la peticion de forma segura. Intentalo de nuevo.';
}
