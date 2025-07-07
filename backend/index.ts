import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { envConfig } from './config/env.config';

const app = express();

const port = envConfig.PORT

app.use(express.json());
app.use(express.urlencoded());

app.use(morgan('dev'));

app.get('/', (req: any, res: any) => {
  res.json({
    message: "Le serveur d'essenz+ est en marche",
  });
});

app.listen(envConfig.PORT, async () => {
  console.log(`Serveur démarré avec succéss ${envConfig.PORT}`);
});
