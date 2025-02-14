import { BadRequestError, BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { generateToken } from './token.service';
import config from '@/config/env.config';
import _ from 'lodash';

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
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const foundedUser = await User.findOne({ email: req.body.email });
    if (!foundedUser) {
        throw new BadRequestFormError('Có lỗi xảy ra', {
            message: 'Tài khoản không tồn tại trong hệ thống!',
            field: 'email',
        });
    }
    const isMatchedPassword = await bcrypt.compare(req.body.password, foundedUser?.password);
    if (!isMatchedPassword) {
        throw new BadRequestFormError('Có lỗi xảy ra', {
            message: 'Mật khẩu hoặc tài khoản không đúng!',
            field: 'password',
        });
    }
    const accessToken = await generateToken(foundedUser, config.jwt.accessTokenKey, config.jwt.accessVerifyExpiration);
    const user = _.pick(foundedUser, ['_id', 'userName', 'email', 'role']);
    return res.status(StatusCodes.ACCEPTED).json(
        customResponse({
            data: { ...user, accessToken },
            message: 'Đăng nhập thành công',
            status: StatusCodes.ACCEPTED,
            success: true,
        }),
    );
};
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const foundedUser = await User.findOne({ _id: req.userId });
    if (!foundedUser) {
        throw new BadRequestError('Không tìm thấy user');
    }
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: foundedUser,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
