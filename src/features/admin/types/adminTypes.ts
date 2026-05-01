import type { VerificationDocument } from '../../verification/types/verificationTypes';

export interface AdminUserSummary {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  primaryRole: string | null;
  roles: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface AdminUserDetail extends AdminUserSummary {
  acceptedTerms: boolean;
  acceptedPrivacyPolicy: boolean;
  profile: Record<string, unknown> | null;
  verificationDocuments: VerificationDocument[];
}
