import { PrismaClient } from '../../lib/generated/prisma'
import { stepFourDto, stepOneDto, stepThreeDto, stepTwoDto, User } from '../../types/userTypes'
import AppError from '../../middlewares/AppError'

export class OnboardingService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  public async updateOnboardingStepOne(userId: string, data: stepOneDto): Promise<User> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found')
    }

    const user = this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      include: {
        sessions: true,
      },
    })
    return user
  }

  public async updateOnboardingStepTwo(userId: string, data: stepTwoDto): Promise<User> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found')
    }

    const user = this.prisma.user.update({
      where: { id: userId },
      data: {
        age: data.age,
      },
      include: {
        sessions: true,
      },
    })
    if (!user) {
      throw new AppError('User not found', 404, true, 'User not found')
    }
    return user
  }

  public async updateonboardingStepThree(userId: string, data: stepThreeDto): Promise<User> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found')
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        bio: data.bio,
      },
      include: { sessions: true },
    })
  }

  public async updateonboardingStepFour(userId: string, data: stepFourDto): Promise<User> {
    if (!userId) {
      throw new AppError('User not found', 404, true, 'User not found')
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: data.avatarUrl,
      },
      include: { sessions: true },
    })
  }
}
