import { categoryController } from '@/controllers';
import { Router } from 'express';

const router = Router();
router.post('/create', categoryController.create);
router.get('/all', categoryController.getAll);
router.get('/:id', categoryController.getDetail);
router.patch('/:id', categoryController.updateCategory);

export default router;
