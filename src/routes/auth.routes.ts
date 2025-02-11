import { authController } from '@/controllers';
import { registerValidation } from '@/validation/user/userSchema';
import validator from '@/validation/validator';
import { Router } from 'express';

const router = Router();

router.post('/register',validator(registerValidation) , authController.register)

export default router;
