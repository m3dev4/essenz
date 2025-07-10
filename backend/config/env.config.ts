import dotenv from 'dotenv';
import { getEnv } from '../utils/getEnv';

dotenv.config();

const appcConfig = () => {
  // Déterminer si nous somme en développment
  const isDevelopement = getEnv('NODE_ENV', 'developement') === 'development';

  return {
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    PORT: getEnv('PORT', '8080'),
    SENTRY_DSN: getEnv('SENTRY_DSN', ''),
    RESEND_API: getEnv('RESEND_API', ''),
    JWT_SECRET: getEnv('JWT_SECRET', ''),
  };
};

export const envConfig = appcConfig();
