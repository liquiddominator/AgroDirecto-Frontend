import { env } from '../../../config/env';
import { apiRequest, toJsonBody } from '../../../lib/api/httpClient';
import type {
  ReviewDecisionRequest,
  VerificationDocument,
} from '../types/verificationTypes';

export function listMyVerificationDocuments() {
  return apiRequest<VerificationDocument[]>('/api/verification/documents');
}

export function uploadVerificationDocument(request: {
  documentTypeCode: string;
  documentNumber?: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append('documentTypeCode', request.documentTypeCode);
  if (request.documentNumber?.trim()) {
    formData.append('documentNumber', request.documentNumber.trim());
  }
  formData.append('file', request.file);

  return apiRequest<VerificationDocument>('/api/verification/documents', {
    method: 'POST',
    body: formData,
  });
}

export function documentFileUrl(downloadUrl: string) {
  return `${env.apiBaseUrl}${downloadUrl}`;
}

export function reviewVerificationDocument(documentId: number, request: ReviewDecisionRequest) {
  return apiRequest<VerificationDocument>(`/api/admin/verifications/documents/${documentId}/review`, {
    method: 'POST',
    body: toJsonBody(request),
  });
}
