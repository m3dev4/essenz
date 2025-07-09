import * as Sentry from '@sentry/node';

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;
  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean,
    status: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
    Sentry.captureException(this);
  }
}

export default AppError;
