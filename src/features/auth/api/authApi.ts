import { apiRequest, toJsonBody } from '../../../lib/api/httpClient';
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../types/authTypes';

export function login(request: LoginRequest) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: toJsonBody(request),
  });
}

export function register(request: RegisterRequest) {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: toJsonBody(request),
  });
}

export function getCurrentUser() {
  return apiRequest<AuthUser>('/api/auth/me');
}

export function logout(refreshToken: string) {
  return apiRequest<void>('/api/auth/logout', {
    method: 'POST',
    auth: false,
    body: toJsonBody({ refreshToken }),
  });
}
