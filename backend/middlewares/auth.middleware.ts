import { NextFunction, Request, Response } from 'express'
import { PrismaClient, UserRoles } from '../lib/generated/prisma'
import AppError from './AppError'
import * as jwt from 'jsonwebtoken'
import { envConfig } from '../config/env.config'
import { User } from '../types/userTypes'
import asynchandler from './asynchandler'

/**
 * Middleware d'authentification JWT pour Express.
 *
 * Ce middleware vérifie la présence d'un token JWT dans les cookies de la requête (`jwt`).
 * Si le token existe, il est vérifié à l'aide du secret configuré dans les variables d'environnement.
 * Si la vérification réussit, l'utilisateur correspondant est récupéré en base via Prisma et attaché à la requête (`req.user`).
 * En cas d'absence de token, d'échec de vérification ou d'utilisateur inexistant, une erreur d'authentification est levée.
 *
 * Dépendances :
 * - express : pour les types Request, Response, NextFunction
 * - PrismaClient, UserRoles : accès à la base de données via Prisma ORM et gestion des rôles
 * - AppError : gestion personnalisée des erreurs applicatives
 * - jsonwebtoken : vérification et décodage du JWT
 * - envConfig : accès aux variables d'environnement (notamment JWT_SECRET)
 * - User : type utilisateur personnalisé
 * - asynchandler : wrapper pour la gestion asynchrone des middlewares
 *
 * Interfaces :
 * - RequestWithUser : étend Request pour inclure la propriété `user`
 * - JwtPayloadWithUser : structure du payload JWT attendu (doit contenir `userId`)
 *
 * Export :
 * - isAuthenticated : middleware à utiliser sur les routes nécessitant une authentification JWT valide
 */

const prisma = new PrismaClient()

interface RequestWithUser extends Request {
  user?: User
}

interface JwtPayloadWithUser extends jwt.JwtPayload {
  userId: string
}

const isAuthenticated = asynchandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt

    const authHeader = req.headers.authorization
    if (!token && authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1]
    }

    const sessionId = req.headers['x-session-id'] as string | undefined
    if (!token && sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      })
      if (session) {
        req.user = { id: session.userId } as User
        return next()
      }
    }

    if (!token) {
      return next(new AppError('Unauthorized', 401, true, 'Unauthorized'))
    }

    try {
      const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayloadWithUser
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { sessions: true },
      })
      if (!user) {
        return next(new AppError('User not found', 401, true, 'Unauthorized'))
      }
      req.user = user
      next()
    } catch (error) {
      return next(new AppError('Unauthorized', 401, true, 'Unauthorized'))
    }
  }
)

const isAdmin = asynchandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRoles.ADMIN) {
    next()
  } else {
    return next(new AppError('Unauthorized', 401, true, 'Unauthorized'))
  }
})

export { isAuthenticated, isAdmin }
