export type ReviewDecision = 'APPROVED' | 'REJECTED';

export interface VerificationReview {
  id: number;
  decision: ReviewDecision;
  reason: string | null;
  evidenceUrl: string | null;
  reviewedByUserId: number;
  reviewedByFullName: string;
  reviewedAt: string;
}

export interface VerificationDocument {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  userStatus: string;
  documentTypeCode: string;
  documentTypeName: string;
  documentNumber: string | null;
  originalFilename: string | null;
  mimeType: string | null;
  downloadUrl: string;
  uploadedAt: string;
  latestReview: VerificationReview | null;
}

export interface ReviewDecisionRequest {
  decision: ReviewDecision;
  reason?: string;
  evidenceUrl?: string;
}
