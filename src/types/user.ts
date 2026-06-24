export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface UserPreference {
  theme: 'light' | 'dark';
  currency: string;
  region: string;
  language: string;
}

export interface Consent {
  privacyAccepted: boolean;
  termsAccepted: boolean;
  privacyAcceptedAt?: Date;
  termsAcceptedAt?: Date;
}