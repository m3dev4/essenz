import * as Sentry from '@sentry/node';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { envConfig } from './config/env.config';
import userRoutes from './routes/user.route';
const app = express();
Sentry.init({
  dsn: envConfig.SENTRY_DSN,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

app.use(express.json());
app.use(express.urlencoded());

app.use(morgan('dev'));
app.use(function onError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.statusCode = 500;
  res.end(Sentry.captureException(err) + '\n');
});

app.use('/api/v1/user/auth', userRoutes);

app.get('/', (req: any, res: any) => {
  res.json({
    message: "Le serveur d'essenz+ est en marche",
  });
});
// app.get('/debug-sentry', function mainHandler(req: Request, res: Response) {
//   Sentry.captureException(new Error('My first Sentry error!'));
// });

app.listen(envConfig.PORT, async () => {
  console.log(`Serveur démarré avec succéss ${envConfig.PORT}`);
});
