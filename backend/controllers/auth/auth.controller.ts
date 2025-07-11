import { NextFunction, Request, Response } from 'express';
import asynchandler from '../../middlewares/asynchandler';
import { UserService } from '../../services/user/user.service';
import {
  signUpValidator,
  verifyEmailValidator,
} from '../../validators/userValidator';
import AppError from '../../middlewares/AppError';
import { UserCreateDto } from '../../types/userTypes';

export class UserController {
  private UserService: UserService;

  constructor() {
    this.UserService = new UserService();
  }

  // Crée un utilisateur
  public createUser = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await signUpValidator.validate(req.body);

        const userData: UserCreateDto = req.body;

        const user = await this.UserService.createUser(userData);

        res.status(201).json({
          success: true,
          message: 'User created successfully',
          data: user,
        });
      } catch (error: any) {
        throw new AppError(error.message, 500, true, error.message);
      }
    },
  );

  // Verifier l'email
  public verifyEmail = asynchandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await verifyEmailValidator.validate(req.body);
        const { email, token } = req.body;

        const user = await this.UserService.verifyUserEmail(email, token);
        const session = await this.UserService.createSession(user.id, '', '');
        res.status(200).json({
          success: true,
          message: 'Email verified successfully',
          data: { user, sessionId: session.id },
        });
      } catch (error: any) {
        throw new AppError(error.message, 500, true, error.message);
      }
    },
  );
}
