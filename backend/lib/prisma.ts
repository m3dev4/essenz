import { envConfig } from '../config/env.config';
import { PrismaClient } from './generated/prisma/wasm';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      envConfig.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (envConfig.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
