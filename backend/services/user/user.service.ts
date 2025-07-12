import { PrismaClient, UserRoles } from '../../lib/generated/prisma';
import { sendVerificationEmail } from '../../mail/resend';
import AppError from '../../middlewares/AppError';
import { LoginDto, User, UserCreateDto } from '../../types/userTypes';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class UserService {
  private prisma: PrismaClient;

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
    location: string,
    deviceInfo: string,
  ) {
    return await this.prisma.session.create({
      data: {
        userId,
        location,
        deviceInfo,
        isOnline: true,
        lastActiveAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  //Login
  public async login(
    loginData: LoginDto,
  ): Promise<{ user: User; sessionId: string }> {
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

    const session = await this.createSession(user.id, '', '');

    return { user, sessionId: session.id };
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
  public async getProfileByUsername(username: string): Promise<User> {
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
}
