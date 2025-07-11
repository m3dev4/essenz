import express from 'express';
import { UserController } from '../controllers/auth/auth.controller';

const userController = new UserController();

const router: express.Router = express.Router();

router.post('/register', userController.createUser);
router.post('/verify-email', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

export default router;
