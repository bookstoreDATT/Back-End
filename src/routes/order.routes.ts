import { ROLE } from '@/constants/allowedRoles';
import { orderController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { Router } from 'express';

const router = Router();

// @Post
router.post('/create', authenticate, orderController.createOrder);
router.post('/confirm', authenticate, authorize(ROLE.ADMIN), orderController.confirmOrder);
router.post('/cancel', authenticate, authorize(ROLE.ADMIN), orderController.cancelOrder);
router.post('/shipping', authenticate, authorize(ROLE.ADMIN), orderController.shippingOrder);
router.post('/deliver', authenticate, authorize(ROLE.ADMIN), orderController.deliverOrder);
router.post('/finish', authenticate, authorize(ROLE.ADMIN), orderController.finishOrder);

// @Get
router.get('/all', authenticate, authorize(ROLE.ADMIN), orderController.getAllOrders);
router.get('/', authenticate, orderController.getAllOrderByUser);
router.get('/:id', authenticate, orderController.getDetailedOrder);

export default router;
