import { OnboardingService } from '../../services/user/onboarding.service'
import asynchandler from '../../middlewares/asynchandler'
import { NextFunction, Request, Response } from 'express'
import {
  onboardingValidatorStepFour,
  onboardingValidatorStepOne,
  onboardingValidatorStepThree,
  onboardingValidatorStepTwo,
} from '../../validators/onboardingValidation'
import { stepFourDto, stepOneDto, stepThreeDto, stepTwoDto } from '../../types/userTypes'
import AppError from '../../middlewares/AppError'

export class OnboardingController {
  private onboardingStepService: OnboardingService

  constructor() {
    this.onboardingStepService = new OnboardingService()
  }

  public updateOnboardingStepOne = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await onboardingValidatorStepOne.validate(req.body)
        const stepOneData: stepOneDto = req.body
        const userId = req.params.id
        const userUpdate = await this.onboardingStepService.updateOnboardingStepOne(
          userId,
          stepOneData
        )
        res.status(200).json({
          success: true,
          message: 'User updated successfully',
          data: userUpdate,
        })
      } catch (error: any) {
        console.error('Error updating user:', error)
        throw new AppError(error.message, 500, true, error.message)
      }
    }
  )

  public updateOnboardingStepTwo = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await onboardingValidatorStepTwo.validate(req.body)
        const stepTwo: stepTwoDto = req.body
        const userId = req.params.id

        const userAge = await this.onboardingStepService.updateOnboardingStepTwo(userId, stepTwo)

        res.status(200).json({
          success: true,
          message: 'User age updated successfully',
          data: userAge,
        })
      } catch (error: any) {
        console.error('Error updating user age: ', error)
        throw new AppError(error.message, 500, true, error.message)
      }
    }
  )

  public updateOnboardingStepThree = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await onboardingValidatorStepThree.validate(req.body)
        const stepThree: stepThreeDto = req.body
        const userId = req.params.id

        const userBio = await this.onboardingStepService.updateonboardingStepThree(
          userId,
          stepThree
        )

        res.status(200).json({
          success: true,
          message: 'User bio updated successfully',
          data: userBio,
        })
      } catch (error: any) {
        console.error('Error updating user bio: ', error)
        throw new AppError(error.message, 500, true, error.message)
      }
    }
  )

  public updateOnboardingStepFour = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const file = req.file;
        if (!file) {
          throw new AppError('Aucun fichier envoyé', 400, true, 'No file uploaded');
        }
        // Instancie ton UploadService ici ou injecte-le selon ton architecture
        const { UploadService } = await import('../../services/upload/upload.service');
        const uploadService = new UploadService();
        const avatarUrl = await uploadService.uploadAvatar(file);
        const userId = req.params.id;

        const userAvatar = await this.onboardingStepService.updateonboardingStepFour(
          userId,
          { avatarUrl }
        );

        res.status(200).json({
          success: true,
          message: 'User avatar updated successfully',
          data: userAvatar,
        });
      } catch (error: any) {
        console.error('Error updating user avatar: ', error);
        throw new AppError(error.message, 500, true, error.message);
      }
    }
  )
}
