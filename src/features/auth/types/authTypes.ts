export type RegisterRole = 'PRODUCER' | 'BUYER' | 'CARRIER';
export type ProducerType = 'INDIVIDUAL' | 'ASSOCIATION' | 'COOPERATIVE';
export type BuyerType = 'INDIVIDUAL' | 'BUSINESS' | 'COMPANY';
export type TransportType = 'TRUCK' | 'PICKUP' | 'MOTORBIKE' | 'OTHER';
export type OperationZone = 'LOCAL' | 'REGIONAL' | 'DEPARTMENTAL';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  status: string;
  primaryRole: RegisterRole | string | null;
  roles: string[];
}

export interface AuthResponse {
  tokenType: 'Bearer' | string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProducerProfileRequest {
  producerType: ProducerType;
  farmName: string;
  municipality: string;
  province: string;
  department: string;
  experienceYears: number;
  geoLatitude?: number | null;
  geoLongitude?: number | null;
}

export interface BuyerProfileRequest {
  buyerType: BuyerType;
  businessName?: string | null;
  cityOrPurchaseZone: string;
}

export interface CarrierProfileRequest {
  transportType: TransportType;
  loadCapacityKg: number;
  operationZone: OperationZone;
  driverLicenseNumber: string;
  vehiclePlate: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: RegisterRole;
  acceptedTerms: boolean;
  acceptedPrivacyPolicy: boolean;
  producerProfile?: ProducerProfileRequest;
  buyerProfile?: BuyerProfileRequest;
  carrierProfile?: CarrierProfileRequest;
}

export interface AuthSession {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
}
