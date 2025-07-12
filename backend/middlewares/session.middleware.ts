import { NextFunction, Request, Response } from 'express';
import AppError from './AppError';
import { PrismaClient } from '../lib/generated/prisma';
import { User } from '../types/userTypes';

/**
 * Middleware d'authentification de session pour Express.
 *
 * Ce middleware vérifie la présence d'un cookie de session (`sessionId`) dans la requête.
 * Si le cookie existe, il tente de retrouver la session correspondante dans la base de données Prisma.
 * Si la session est valide et associée à un utilisateur, l'utilisateur est attaché à la requête (`req.user`).
 * Sinon, une erreur d'authentification est levée.
 *
 * Dépendances :
 * - express : pour les types Request, Response, NextFunction
 * - AppError : gestion personnalisée des erreurs applicatives
 * - PrismaClient : accès à la base de données via Prisma ORM
 * - User : type utilisateur personnalisé
 *
 * Interfaces :
 * - RequestWithUser : étend Request pour inclure les propriétés `user` et `sessionId`
 *
 * Export :
 * - authenticateSession : middleware à utiliser sur les routes nécessitant une session utilisateur valide
 */

interface RequestWithUser extends Request {
  user?: User;
  sessionId: string;
}

const prisma = new PrismaClient();

export const authenticateSession = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return next(new AppError('Session not found', 401, true, 'Unauthorized'));
    }
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session) {
      return next(new AppError('Session not found', 401, true, 'Unauthorized'));
    }

    if (new Date() > new Date(session.expiresAt)) {
      await prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
      return next(new AppError('Session expired', 401, true, 'Unauthorized'));
    }

    if (!req.user) {
      const user = await prisma.user.findUnique({
        where: {
          id: session.userId,
        },
        include: {
          sessions: true,
        },
      });
      if (!user) {
        return next(new AppError('User not found', 401, true, 'Unauthorized'));
      }
      req.user = user;
      req.sessionId = sessionId;
    }
    next();
  } catch (error:any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
