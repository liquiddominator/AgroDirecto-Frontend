/**
 * Convierte un identificador de rol a una etiqueta legible.
 * @param role Identificador del rol (e.g., 'PRODUCER').
 * @returns La etiqueta para mostrar en la UI.
 */
export function formatRole(role: string | null | undefined): string {
  if (!role) {
    return 'Sin rol';
  }

  const labels: Record<string, string> = {
    PRODUCER: 'Productor',
    BUYER: 'Comprador',
    CARRIER: 'Transportista',
    ADMIN: 'Administrador',
  };
  return labels[role] ?? role;
}

/**
 * Convierte un tipo de productor a una etiqueta legible.
 * @param type Identificador del tipo de productor.
 * @returns La etiqueta para mostrar en la UI.
 */
export function formatProducerType(type: string): string {
  const labels: Record<string, string> = {
    INDIVIDUAL: 'Individual',
    ASSOCIATION: 'Asociación',
    COOPERATIVE: 'Cooperativa',
  };
  return labels[type] ?? type;
}