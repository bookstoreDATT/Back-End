import { BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const fields = [
        { key: 'email', message: 'Email này đã tồn tại!' },
        { key: 'userName', message: 'Tên người dùng này đã tồn tại!' },
    ];
    const results = await Promise.all(fields.map(({ key }) => User.findOne({ [key]: req.body[key] })));
    const errors = fields
        .map((field, index) => (results[index] ? { message: field.message, field: field.key } : null))
        .filter(Boolean) as { message: string; field: string }[];

    if (errors.length > 0) {
        throw new BadRequestFormError('Đã có lỗi xảy ra!', errors);
    }
    const newUser = await User.create({ ...req.body });
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newUser,
            message: 'Đăng ký tài khoản thành công.',
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};
