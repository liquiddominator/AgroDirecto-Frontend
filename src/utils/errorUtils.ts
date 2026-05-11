import { isApiError } from '../lib/api/apiError';

/**
 * Transforma un error de tipo `unknown` a un string legible para el usuario.
 * Si es un ApiError con detalles, los une.
 * @param error El error capturado.
 * @returns Un string con el mensaje de error.
 */
export function resolveErrorMessage(error: unknown): string {
  if (isApiError(error) && error.details) {
    const detailMessages = Object.values(error.details);
    if (detailMessages.length > 0) {
      return detailMessages.join(' ');
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'No se pudo completar la operación. Intente nuevamente.';
}