import { PrismaClient, UserRoles } from '../../lib/generated/prisma';
import { sendVerificationEmail } from '../../mail/resend';
import AppError from '../../middlewares/AppError';
import { User, UserCreateDto } from '../../types/userTypes';
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
        isPremium: false,
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
}
