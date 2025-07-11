import { NextFunction, Request, Response } from 'express';
import asynchandler from '../../middlewares/asynchandler';
import { UserService } from '../../services/user/user.service';
import {
  loginValidator,
  signUpValidator,
  verifyEmailValidator,
} from '../../validators/userValidator';
import AppError from '../../middlewares/AppError';
import { LoginDto, UserCreateDto } from '../../types/userTypes';

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
        const { token, email } = req.body;

        const user = await this.UserService.verifyUserEmail(token, email);
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

  //Login
  public login = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await loginValidator.validate(req.body);

        const userData: LoginDto = req.body;

        const user = await this.UserService.login(userData);
        const session = await this.UserService.createSession(
          user.user.id,
          '',
          '',
        );

        res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          data: { user, sessionId: session.id },
        });
      } catch (error: any) {
        throw new AppError(error.message, 500, true, error.message);
      }
    },
  );
}
