import { ROLE } from '@/constants/allowedRoles';
import { orderController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { Router } from 'express';

const router = Router();

// @Post
router.post('/create', authenticate, orderController.createOrder);
router.patch('/confirm', authenticate, authorize(ROLE.ADMIN), orderController.confirmOrder);
router.patch('/cancel', authenticate, orderController.cancelOrder);
router.patch('/shipping', authenticate, authorize(ROLE.ADMIN), orderController.shippingOrder);
router.patch('/deliver', authenticate, authorize(ROLE.ADMIN), orderController.deliverOrder);
router.patch('/finish', authenticate, orderController.finishOrder);

// @Get
router.get('/all', authenticate, authorize(ROLE.ADMIN), orderController.getAllOrders);
router.get('/', authenticate, orderController.getAllOrderByUser);
router.get('/:id', authenticate, orderController.getDetailedOrder);

export default router;
