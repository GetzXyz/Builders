export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}