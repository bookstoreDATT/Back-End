import asyncHandler from '@/helpers/asyncHandler';
import { payOsService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createPayOsPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await payOsService.createPayOsPayment(req, res, next);
});

export const cancelPaymentLink = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await payOsService.cancelPaymentLink(req, res, next);
});
export const HandlePayOsWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await payOsService.HandlePayOsWebhook(req, res, next);
});
export const updateStockOnCancelOrderPayos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await payOsService.updateStockOnCancelOrderPayos(req, res, next);
});
