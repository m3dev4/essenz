import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from 'dotenv';

const app = express();
//serveur
env.config();

const port = process.env.port || 8080;

app.use(express.json());
app.use(express.urlencoded());

app.use(morgan('dev'));

app.get('/', (req: any, res: any) => {
  res.json({
    message: "Le serveur d'essenz+ est en marche",
  });
});

app.listen(port, async () => {
  console.log(`Serveur démarré avec succéss ${port}`);
});
