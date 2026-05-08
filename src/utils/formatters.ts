import { AlertCircle, FileCheck, XCircle, Clock } from "lucide-react";
import type { VerificationDocument } from '../features/verification/types/verificationTypes';

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

/**
 * Formatea una fecha ISO string a un formato legible.
 * @param value La fecha en formato ISO string.
 * @returns La fecha formateada.
 */
export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-BO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

/**
 * Formatea la decisión de revisión de un documento.
 * @param value La decisión de revisión ('APPROVED' o 'REJECTED').
 * @returns La decisión formateada.
 */
export function formatDecision(value: string): string {
  return value === 'APPROVED' ? 'Aprobado' : 'Rechazado';
}

/**
 * Obtiene la configuración de visualización del estado de un documento de verificación.
 * @param document El documento de verificación.
 * @returns Un objeto con label, bg, color e icon para el estado.
 */
export function getVerificationStatusDisplay(document: VerificationDocument) {
  if (!document.latestReview) {
    return {
      label: 'Pendiente',
      bg: '#FFF3CD', // yellow-50
      color: '#856404', // yellow-800
      icon: AlertCircle,
    };
  } else if (document.latestReview.decision === 'APPROVED') {
    return { label: 'Aprobado', bg: '#D8F3DC', color: '#1B4332', icon: FileCheck }; // green-50
  } else {
    return {
      label: 'Rechazado',
      bg: '#FEE2E2', // red-50
      color: '#7F1D1D', // red-700
      icon: XCircle,
    };
  }
}