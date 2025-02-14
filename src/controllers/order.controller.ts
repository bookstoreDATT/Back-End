import asyncHandler from '@/helpers/asyncHandler';
import { orderService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @Post create order
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.createOrder(req, res, next);
});
// @Get get all orders
export const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.getAllOrders(req, res, next);
});

// @Get get all orders by user
export const getAllOrderByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.getAllOrdersByUser(req, res, next);
});

// @Get get detail order
export const getDetailedOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.getDetailedOrder(req, res, next);
});

// @Post confirm order
export const confirmOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.confirmOrder(req, res, next);
});

// @Post cancel order
export const cancelOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.cancelOrder(req, res, next);
});

// @Post shipping order
export const shippingOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.shippingOrder(req, res, next);
});

// @Post deliver order
export const deliverOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.deliverOrder(req, res, next);
});

// @Post finish order
export const finishOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.finishOrder(req, res, next);
});
