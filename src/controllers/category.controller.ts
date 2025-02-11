import asyncHandler from '@/helpers/asyncHandler';
import { categoryService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @ CREATE CATEGORY
export const create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await categoryService.createCategory(req, res, next);
});

// @ GETALL CATEGORY

export const getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await categoryService.getAllCategory(req, res, next);
});

// @ GET ONE CATEGORY
export const getDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await categoryService.getDetailedCategory(req, res, next);
});
// @ UPDATE CATEGORY
export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await categoryService.updateCategory(req, res, next);
});
