import express from 'express';
import { UserController } from '../controllers/auth/auth.controller';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';

const userController = new UserController();

const router: express.Router = express.Router();

router.post('/register', userController.createUser);
router.post('/verify-email', userController.verifyEmail);
router.post('/login', userController.login);

router.post('/logout', isAuthenticated, userController.logout);

//Public profile
router.get('/profile/username/:username', userController.getProfileByUsername);

//Private profile
router.get('/profile/me/:id', isAuthenticated, userController.getProfile);
router.put('/profile/update/:id', isAuthenticated, userController.updateUser);
router.delete(
  '/profile/delete/:id',
  isAuthenticated,
  userController.deleteUser,
);
router.get(
  '/profile/sessions/:id',
  isAuthenticated,
  userController.getAllSession,
);

///Route admin
router.get(
  '/admin/users',
  isAuthenticated,
  isAdmin,
  userController.getAllUsers,
);
router.get(
  '/admin/users/:id',
  isAuthenticated,
  isAdmin,
  userController.getUserById,
);
router.delete(
  '/admin/users/delete/:id',
  isAuthenticated,
  isAdmin,
  userController.deleteUserById,
);

export default router;
