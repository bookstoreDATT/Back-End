import asyncHandler from '@/helpers/asyncHandler';
import { tagService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @ CREATE CATEGORY
export const create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await tagService.createTag(req, res, next);
});

// @ GETALL CATEGORY

export const getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await tagService.getAllTag(req, res, next);
});

// @ GET ONE CATEGORY
export const getDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await tagService.getDetailedTag(req, res, next);
});
// @ UPDATE CATEGORY
export const update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await tagService.updateTag(req, res, next);
});
