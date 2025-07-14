import { envConfig } from '../../config/env.config';
import { PrismaClient, UserRoles } from '../../lib/generated/prisma';
import { sendVerificationEmail } from '../../mail/resend';
import AppError from '../../middlewares/AppError';
import {
  LoginDto,
  updateUserDto,
  User,
  UserCreateDto,
  userProfile,
} from '../../types/userTypes';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class UserService {
  private prisma: PrismaClient;

  private generateJWT(userId: string): string {
    return jwt.sign({ userId }, envConfig.JWT_SECRET, { expiresIn: '1d' });
  }

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Créer un utilisateur
  public async createUser(userData: UserCreateDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new AppError(
        'User already exists',
        400,
        true,
        'User already exists',
      );
    }

    const usernameExist = await this.prisma.user.findUnique({
      where: { username: userData.username },
    });
    if (usernameExist) {
      throw new AppError(
        'Username already exists',
        400,
        true,
        'Username already exists',
      );
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const verificationToken = crypto.randomInt(100000, 999999).toString();
    const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    //créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: passwordHash,
        isVerified: false,
        verificationToken,
        verificationTokenExpiresAt,
        firstName: '',
        lastName: '',
        bio: '',
        avatarUrl: '',
        role: UserRoles.USER,
      },
      include: {
        sessions: true,
      },
    });
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (error: any) {
      throw new AppError(error.message, 500, true, error.message);
    }
    return user;
  }

  //Verify user email
  public async verifyUserEmail(token: string, email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: String(token),
        email: email.toLowerCase().trim(),
        isVerified: false,
      },
      include: {
        sessions: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, true, 'User not found');
    }

    if (user.isVerified) {
      throw new AppError(
        'User already verified',
        400,
        true,
        'User already verified',
      );
    }
    if (user.verificationTokenExpiresAt) {
      if (user.verificationTokenExpiresAt < new Date()) {
        throw new AppError(
          'Verification token expired',
          400,
          true,
          'Verification token expired',
        );
      }
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
      include: {
        sessions: true,
      },
    });
    return updatedUser;
  }
  // Créer une session apres la verification
  public async createSession(
    userId: string,
    sessionData: {
      ipAdress: string;
      userAgent: string;
      deviceType: string;
      browser?: string;
      os?: string;
      location: string;
    },
  ) {
    return await this.prisma.session.create({
      data: {
        userId,
        ipAdress: sessionData.ipAdress,
        userAgent: sessionData.userAgent,
        deviceType: sessionData.deviceType,
        browser: sessionData.browser,
        os: sessionData.os,
        location: sessionData.location || '',
        deviceInfo: `${sessionData.deviceType} - ${sessionData.browser || 'Unknown'} - ${sessionData.os || 'Unknown'}`,
        isOnline: true,
        lastActiveAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  //Login
  public async login(
    loginData: LoginDto,
    sessionInfo: {
      ipAdress: string;
      userAgent: string;
      deviceType: string;
      browser?: string;
      os?: string;
      location: string;
    },
  ): Promise<{ user: User; sessionId: string; token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginData.email.toLowerCase().trim() },
      include: { sessions: true },
    });

    if (!user) {
      throw new AppError('User not found', 404, true, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AppError('Invalid password', 401, true, 'Invalid password');
    }

    const session = await this.createSession(user.id, sessionInfo);
    const token = this.generateJWT(user.id);

    return { user, sessionId: session.id, token };
  }

  //Logout
  public async logout(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    console.log(session);
    if (!session) {
      throw new AppError('Session not found', 404, true, 'Session not found');
    }
    return await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  // getProfile User
  public async getProfileUser(userId: string): Promise<User> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: true,
      },
    });
    if (!user) {
      throw new AppError('User not found', 404, true, 'User not found');
    }
    return user;
  }

  //GetProfleByUsername
  public async getProfileByUsername(username: string): Promise<userProfile> {
    if (!username) {
      throw new AppError('Username not found', 404, true, 'Username not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      include: {
        sessions: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, true, 'User not found');
    }

    return user;
  }

  //Update user
  public async updateUser(
    userId: string,
    userData: updateUserDto,
  ): Promise<User> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found');
    }

    // Préparer les données à mettre à jour
    const updateData: any = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      bio: userData.bio,
      avatarUrl: userData.avatarUrl,
    };

    // Si un nouveau mot de passe est fourni
    if (userData.password && userData.currentPassword) {
      // Récupérer l'utilisateur pour vérifier l'ancien mot de passe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404, true, 'User not found');
      }

      // Vérifier l'ancien mot de passe
      const isCurrentPasswordValid = await bcrypt.compare(
        userData.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new AppError(
          'Current password is invalid',
          401,
          true,
          'Current password is invalid',
        );
      }

      // Hacher le nouveau mot de passe
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);
      updateData.password = passwordHash;
    }

    // Mettre à jour l'utilisateur
    const userUpdate = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        sessions: true,
      },
    });

    return userUpdate;
  }

  //delete user
  public async deleteUser(userId: string): Promise<any> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found');
    }
    await this.prisma.session.deleteMany({
      where: { userId: userId },
    });
    const user = await this.prisma.user.delete({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(
        'User can be delete because is not found',
        404,
        true,
        'User can be delete because is not found',
      );
    }
    return user;
  }

  //get all user
  public async getAllUser(): Promise<any> {
    const user = await this.prisma.user.findMany({
      include: {
        sessions: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, true, 'User not found');
    }

    return user;
  }

  //Get user By Id
  public async getUserById(userId: string): Promise<User | null> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found');
    }
    const user = this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: true,
      },
    });
    if (!user) {
      throw new AppError('User not found', 404, true, 'User not found');
    }
    return user;
  }

  //Delete user by ID
  public async deleteUserById(userId: string): Promise<any> {
    const user = await this.prisma.user.delete({
      where: { id: userId },
    });
    const session = await this.prisma.session.deleteMany({
      where: { userId: userId },
    });

    if (!user || !session) {
      throw new AppError(
        'User can be delete because is not found',
        404,
        true,
        'User can be delete because is not found',
      );
    }
    return user;
  }
}
