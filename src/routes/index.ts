import { Router } from 'express';
import authRouter from './auth.routes';
import categoryRouter from './category.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/tags');

export default router;
