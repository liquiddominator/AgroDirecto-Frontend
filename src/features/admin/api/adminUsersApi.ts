import { apiRequest } from '../../../lib/api/httpClient';
import type { AdminUserDetail, AdminUserSummary } from '../types/adminTypes';

export function listAdminUsers() {
  return apiRequest<AdminUserSummary[]>('/api/admin/users');
}

export function getAdminUserDetail(userId: number) {
  return apiRequest<AdminUserDetail>(`/api/admin/users/${userId}`);
}
