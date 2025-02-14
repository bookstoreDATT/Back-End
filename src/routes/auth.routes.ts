import { authController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { loginValidation, registerValidation } from '@/validation/user/userSchema';
import validator from '@/validation/validator';
import { Router } from 'express';

const router = Router();

router.post('/register', [validator(registerValidation)], authController.register);
router.post('/login', [validator(loginValidation)], authController.login);
router.get('/profile', authenticate, authController.getProfile);

export default router;
