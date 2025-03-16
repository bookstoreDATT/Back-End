import { payosController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.post('/create', authenticate, payosController.createPayOsPayment);
router.post('/cancel/update-stock', authenticate, payosController.updateStockOnCancelOrderPayos);

router.delete('/cancel/:id', authenticate, payosController.cancelPaymentLink);

export default router;
