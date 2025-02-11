import { Router } from 'express';
import authRouter from './auth.routes';
import categoryRouter from './category.routes';
import tagRouter from './tag.routes';
import productRouter from './product.routes';
const router = Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/tags', tagRouter);
router.use('/products', productRouter);

export default router;
