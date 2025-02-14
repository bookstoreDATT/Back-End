import { productController } from '@/controllers';
import upload from '@/middlewares/multerMiddleware';
import { Router } from 'express';

const router = Router();

router.post(
    '/create',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]),
    productController.create,
);
router.patch(
    '/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]),
    productController.update,
);
router.get('/all', productController.getAll);
router.get('/:id', productController.getDetailedProduct);
router.get('/related/:id', productController.getRelatedProducts);
router.delete('/:id', productController.hide);

export default router;
