import { ROLE } from '@/constants/allowedRoles';
import { tagController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/all', tagController.getAll);
router.get('/:id', tagController.getDetail);
router.post('/create', tagController.create);
router.patch('/:id', authenticate, authorize(ROLE.ADMIN), tagController.update);

export default router;
