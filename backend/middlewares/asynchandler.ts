import { NextFunction, Request, Response } from 'express';

const asynchandler =
  (fn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error(`error: ${err.message}`);
      res.status(err.statusCode || 500).json({
        message: err.message || 'Something wen wrong ☹',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        success: false,
      });
    });
  };

export default asynchandler;
