import { ROLE } from '@/constants/allowedRoles';
import { categoryController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { Router } from 'express';

const router = Router();
router.post('/create', authenticate, authorize(ROLE.ADMIN), categoryController.create);
router.get('/all', categoryController.getAll);
router.get('/:id', categoryController.getDetail);
router.patch('/:id', authenticate, authorize(ROLE.ADMIN), categoryController.updateCategory);

export default router;
