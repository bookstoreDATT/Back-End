import asyncHandler from '@/helpers/asyncHandler';
import { productService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @ CREATE PRODUCT
export const create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.createProduct(req, res, next);
});
// @ UPDATE PRODUCT
export const update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.updateProduct(req, res, next);
});
// @ GET ALL PRODUCTS
export const getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.getAllProduct(req, res, next);
});
// @ GET DETAIL PRODUCT
export const getDetailedProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.getDetailedProduct(req, res, next);
});
// @ GET RELATED PRODUCT
export const getRelatedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.getRelatedProduct(req, res, next);
});
// @ HIDE PRODUCT
export const hide = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.hideProduct(req, res, next);
});
