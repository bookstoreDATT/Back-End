import { authController } from '@/controllers';
import { registerValidation } from '@/validation/user/userSchema';
import validator from '@/validation/validator';
import { Router } from 'express';

const router = Router();

router.post('/register', [validator(registerValidation)], authController.register);
router.post('/login', authController.login);

export default router;
