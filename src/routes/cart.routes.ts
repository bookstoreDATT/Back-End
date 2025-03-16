import { cartController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

// @Get
router.get('/all', authenticate, cartController.getCartByUser);

// @post
router.post('/', authenticate, cartController.addToCart);
router.post('/remove', authenticate, cartController.removeCartItem);
router.post('/remove/all', authenticate, cartController.removeAllCartItems);
router.post('/update', authenticate, cartController.updateCartItemQuantity);

export default router;
