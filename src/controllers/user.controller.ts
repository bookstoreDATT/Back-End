import asyncHandler from '@/helpers/asyncHandler';
import { userService } from '@/services';
import { NextFunction, Request, Response } from 'express';
// @UPDATE PROFILE
export const update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await userService.updateUserProfile(req, res);
});
// @ CHANGE PASSWORD
export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await userService.changePassword(req, res);
});
