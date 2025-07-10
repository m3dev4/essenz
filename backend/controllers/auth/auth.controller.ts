import { NextFunction, Request, Response } from 'express';
import asynchandler from '../../middlewares/asynchandler';
import { UserService } from '../../services/user/user.service';
import { signUpValidator } from '../../validators/userValidator';
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
        // const error = signUpValidator.validate(req.body);
        // if (error) {
        //   throw new AppError(error.message, 400, true, error.message);
        // }

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
}
