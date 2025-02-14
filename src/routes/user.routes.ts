import { userController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import upload from '@/middlewares/multerMiddleware';
import { Router } from 'express';

const router = Router();

router.patch('/update', authenticate, upload.single('avatar'), userController.update);
router.patch('/changePassword', authenticate, userController.changePassword);
export default router;
