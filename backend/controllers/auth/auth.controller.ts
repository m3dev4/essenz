import { NextFunction, Request, Response } from 'express'
import asynchandler from '../../middlewares/asynchandler'
import { UserService } from '../../services/user/user.service'
import {
  loginValidator,
  signUpValidator,
  updateUserValidator,
  verifyEmailValidator,
} from '../../validators/userValidator'
import AppError from '../../middlewares/AppError'
import { LoginDto, updateUserDto, UserCreateDto } from '../../types/userTypes'
import { extractDeviceInfo, getClientIP } from '../../utils/sessionUtils'

export class UserController {
  private UserService: UserService

  constructor() {
    this.UserService = new UserService()
  }

  // Crée un utilisateur
  public createUser = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await signUpValidator.validate(req.body)

        const userData: UserCreateDto = req.body

        const user = await this.UserService.createUser(userData)

        res.status(201).json({
          success: true,
          message: 'User created successfully',
          data: user,
        })
      } catch (error: any) {
        throw new AppError(error.message, 500, true, error.message)
      }
    }
  )

  // Verifier l'email
  public verifyEmail = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyEmailValidator.validate(req.body)
      const { token, email } = req.body

      const userAgent = req.headers['user-agent'] || ''
      const ipAdress = getClientIP(req)
      const deviceInfo = extractDeviceInfo(userAgent)

      const sessionInfo = {
        ipAdress,
        userAgent,
        ...deviceInfo,
        location: '',
      }

      const user = await this.UserService.verifyUserEmail(token, email)
      const session = await this.UserService.createSession(user.id, sessionInfo)
      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: { user, sessionId: session.id },
      })
    } catch (error: any) {
      throw new AppError(error.message, 500, true, error.message)
    }
  })

  //GetAllsesion
  public getAllSession = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.Id
      const sessions = await this.UserService.getAllSession(userId)
      res.status(200).json({
        success: true,
        message: 'All sessions retrived successfully',
        data: sessions,
      })
    } catch (error: any) {
      throw new AppError(error.message, 500, true, error.message)
    }
  })

  //Login
  public login = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await loginValidator.validate(req.body)

        const userData: LoginDto = req.body
        const userAgent = req.headers['user-agent'] || ''
        const ipAdress = getClientIP(req)
        const deviceInfo = extractDeviceInfo(userAgent)

        const sessionInfo = {
          ipAdress,
          userAgent,
          ...deviceInfo,
          location: '',
        }

        const { user, sessionId, token } = await this.UserService.login(userData, sessionInfo)
        res.cookie('jwt', token, { httpOnly: true, secure: true })

        res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          data: { user, sessionId },
        })
      } catch (error: any) {
        throw new AppError(error.message, 500, true, error.message)
      }
    }
  )

  //logout
  public logout = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Récupérer sessionId depuis le body, headers ou cookies
      const sessionId = req.body.sessionId || req.headers['x-session-id'] || req.cookies.sessionId

      if (!sessionId) {
        throw new AppError('Session ID required', 400, true, 'Session ID required')
      }

      await this.UserService.logout(sessionId)

      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      })

      res.status(200).json({
        success: true,
        message: 'User logged out successfully',
      })
    } catch (error: any) {
      throw new AppError(error.message, 500, true, error.message)
    }
  })

  //getProfile
  public getProfile = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const user = await this.UserService.getProfileUser(userId)
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    })
  })

  //getProfileByUsername
  public getProfileByUsername = asynchandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const username = req.params.username
      const user = await this.UserService.getProfileByUsername(username)
      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      })
    }
  )

  //update user
  public updateUser = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateUserValidator.validate(req.body)
      const userData: updateUserDto = req.body
      const userId = req.params.id
      const user = await this.UserService.updateUser(userId, userData)
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      })
    } catch (error: any) {
      throw new AppError(error.message, 500, true, error.message)
    }
  })

  // delete user
  public deleteUser = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      const user = await this.UserService.deleteUser(userId)
      res.status(200).json({
        success: true,
        message: 'User deleted successfuly',
        data: user,
      })
    } catch (error: any) {
      console.error("Erreur lors du suppression de l'utilisateur", error)
      throw new AppError('Error lors du suppression', 500, true, error)
    }
  })
  //get all users
  public getAllUsers = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.UserService.getAllUser()
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      })
    } catch (error: any) {
      throw new AppError(error.message, 500, true, error.message)
    }
  })

  //Get user by id
  public getUserById = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      const user = await this.UserService.getUserById(userId)
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      })
    } catch (error: any) {
      throw new AppError(error.message, 500, true, error.message)
    }
  })

  //delete user by id
  public deleteUserById = asynchandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      const deleteUser = await this.UserService.deleteUserById(userId)
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: deleteUser,
      })
    } catch (error: any) {
      console.error("Error lors de la suppression de l'utilisateur", error)
      throw new AppError('Error lors de la suppression', 500, true, error)
    }
  })
}
