import { Router } from 'express';
import authRouter from './auth.routes';
import cartRouter from './cart.routes';
import categoryRouter from './category.routes';
import orderRouter from './order.routes';
import productRouter from './product.routes';
import tagRouter from './tag.routes';
import userRouter from './user.routes';
const router = Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/tags', tagRouter);
router.use('/products', productRouter);
router.use('/order', orderRouter);
router.use('/cart', cartRouter);
router.use('/user', userRouter);

export default router;
