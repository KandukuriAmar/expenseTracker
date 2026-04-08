import express from 'express';
const router = express.Router();
import * as authController from '../controller/authController.js';
import * as superAdminController from '../controller/superadminController.js';
import auth from '../middlewares/auth.js';

router.post('/login', authController.loginController);
router.post('/register', authController.registerController);
router.get('/me', auth, authController.getCurrentUserController);
router.post('/logout', auth, authController.logoutController);
router.post('/request-password-reset', superAdminController.requestPasswordReset);

export default router;