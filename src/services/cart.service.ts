import { BadRequestError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get cart by user
export const getCartByUser = async (req: Request, res: Response, next: NextFunction) => {
    const cartUser = await Cart.findOne({ userId: req.userId }).populate(
        'items.productId',
        'name thumbnail stock isHide',
    );

    if (!cartUser) throw new NotFoundError('Không tìm thấy giỏ hàng hoặc giỏ hàng không tồn tại.');

    const filteredProducts = cartUser.items.filter((item) => {
        if (item.quantity > (item.productId as any).stock) {
            item.quantity = (item.productId as any).stock;
        }
        return (item.productId as any).isHide !== true;
    });

    cartUser.items = filteredProducts;
    await cartUser.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: cartUser,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    let updatedCart = null;

    const [product, currentCart] = await Promise.all([
        Product.findById(req.body.productId).select({ stock: 1 }).lean(),
        Cart.findOne({ userId: req.userId })
            .select({ items: 1 })
            .lean<{ items: { productId: string; quantity: number }[] }>(),
    ]);

    if (!product) throw new BadRequestError(`Không tìm thấy sản phẩm với id ${req.body.productId}`);
    if (req.body.quantity < 1) throw new BadRequestError(`Số lượng phải ít nhất là 1`);
    if (req.body.quantity > product.stock!) req.body.quantity = product.stock;

    if (currentCart && currentCart.items.length > 0) {
        const productInThisCart = currentCart.items.find((item) => item.productId == req.body.productId);
        const currentQuantity = productInThisCart?.quantity || 0;
        const newQuantity = currentQuantity + req.body.quantity;

        updatedCart = await Cart.findOneAndUpdate(
            { userId: req.userId, 'items.productId': req.body.productId },
            { $set: { 'items.$.quantity': newQuantity > product.stock! ? product.stock! : newQuantity } },
            { new: true, upsert: false },
        );
    }

    if (!updatedCart) {
        updatedCart = await Cart.findOneAndUpdate(
            { userId: req.userId },
            { $push: { items: { productId: req.body.productId, quantity: req.body.quantity } } },
            { new: true, upsert: true },
        );
    }
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: { data: updatedCart },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    const updatedCart = await Cart.findOneAndUpdate(
        { userId: req.userId },
        { $pull: { items: { productId: req.body.productId } } },
        { new: true },
    );
    if (!updatedCart) throw new BadRequestError(`Không tìm thấy giỏ hàng với userId: ${req.body.userId}`);
    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: updatedCart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Remove all cart items
export const removeAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOneAndUpdate({ userId: req.body.userId }, { items: [] }, { new: true }).lean();

    if (!cart) throw new BadRequestError(`Không tìm thấy giỏ hàng với userId: ${req.body.userId}`);

    return res.status(StatusCodes.NO_CONTENT).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.NO_CONTENT,
            message: ReasonPhrases.NO_CONTENT,
        }),
    );
};

export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.body.productId).select({ stock: 1 }).lean();

    if (!product) throw new BadRequestError(`Không tìm thấy sản phẩm với Id: ${req.body.productId}`);

    if (req.body.quantity < 1) throw new BadRequestError(`Số lượng phải ít nhất là 1`);
    if (req.body.quantity > product.stock!) req.body.quantity = product.stock;

    const updatedQuantity = await Cart.findOneAndUpdate(
        { userId: req.userId, 'items.productId': req.body.productId },
        { $set: { 'items.$.quantity': req.body.quantity } },
        { new: true },
    );

    if (!updatedQuantity)
        throw new BadRequestError(
            `Không tìm thấy sản phẩm với Id: ${req.body.productId} ở trong giỏ hàng hoặc giỏ hàng không  tồn tại`,
        );

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: { data: updatedQuantity },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
