import { BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const errors: { message: string; field: string }[] = [];
    const [foundedEmail, foundedUser] = await Promise.all([
        User.findOne({ email: req.body.email }),
        User.findOne({ userName: req.body.userName }),
    ]);
    if (foundedEmail) {
        errors.push({ message: 'Email này đã tồn tại!', field: 'email' });
    }
    if (foundedUser) {
        errors.push({ message: 'Tên người dùng này đã tồn tại!', field: 'userName' });
    }
    if (errors.length > 0) {
        throw new BadRequestFormError('Đã có lỗi xảy ra!', errors);
    }
    const newUser = await User.create({ ...req.body });
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            message: 'Đăng ký tài khoản thành công.',
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};
