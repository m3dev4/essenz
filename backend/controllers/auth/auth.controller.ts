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
        const { user, sessionId, token } =
          await this.UserService.login(userData);
        res.cookie('jwt', token, { httpOnly: true, secure: true });

        res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          data: { user, sessionId },
        });
      } catch (error: any) {
        throw new AppError(error.message, 500, true, error.message);
      }
    },
  );

  //logout
  public logout = asynchandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Récupérer sessionId depuis le body, headers ou cookies
        const sessionId =
          req.body.sessionId ||
          req.headers['x-session-id'] ||
          req.cookies.sessionId;

        if (!sessionId) {
          throw new AppError(
            'Session ID required',
            400,
            true,
            'Session ID required',
          );
        }

        await this.UserService.logout(sessionId);

        res.clearCookie('jwt', {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });

        res.status(200).json({
          success: true,
          message: 'User logged out successfully',
        });
      } catch (error: any) {
        throw new AppError(error.message, 500, true, error.message);
      }
    },
  );

  //getProfile
  public getProfile = asynchandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const user = await this.UserService.getProfileUser(userId);
      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      });
    },
  );

  //getProfileByUsername
  public getProfileByUsername = asynchandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const username = req.params.username;
      const user = await this.UserService.getProfileByUsername(username);
      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      });
    },
  );
}
