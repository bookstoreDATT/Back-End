import { tagController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/all', tagController.getAll);
router.get('/:id', tagController.getDetail);
router.post('/create', tagController.create);
router.patch('/:id', tagController.update);

export default router;
