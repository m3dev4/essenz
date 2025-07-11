import { UserRoles } from '../lib/generated/prisma';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpiresAt: Date | null;
  isPremium: boolean;
  role: UserRoles;
  sessions: Session[];
}

export interface Session {
  id: string;
  userId: string;
  location: string;
  deviceInfo: string;
  isOnline: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
}
