import express from 'express';
import { UserController } from '../controllers/auth/auth.controller';

const userController = new UserController();

const router: express.Router = express.Router();

router.post('/register', userController.createUser);

export default router;
