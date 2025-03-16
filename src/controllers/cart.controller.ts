import asyncHandler from '@/helpers/asyncHandler';
import { cartService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @Get get cart by user
export const getCartByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.getCartByUser(req, res, next);
});

// @Post add to add
export const addToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.addToCart(req, res, next);
});

// @Post remove cart item
export const removeCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.removeCartItem(req, res, next);
});

// @Post remove all cart item
export const removeAllCartItems = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.removeAllCartItems(req, res, next);
});

// @Post update cart
export const updateCartItemQuantity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.updateCartItemQuantity(req, res, next);
});
