import { BadRequestError, BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import { uploadImages } from '@/utils/cloudinary/uploadImage';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

export const updateUserProfile = async (req: Request, res: Response) => {
    const file = req.file as any;
    const findUser = await User.findOne({ userName: req.body.userName });
    if (findUser && findUser._id.toString() !== req.userId) {
        throw new BadRequestFormError('Có lỗi', { field: 'userName', message: 'Tên người dùng này đã tồn tại' });
    }
    if (file) {
        const url = await uploadImages(file, 'avatars');
        req.body.avatar = url[0];
    } else {
        delete req.body.avatar;
    }
    const profileData = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: profileData,
            success: true,
            status: StatusCodes.OK,
            message: 'Cập nhật thông tin thành công',
        }),
    );
};

export const changePassword = async (req: Request, res: Response) => {
    const foundedUser = await User.findOne({ _id: req.userId });
    if (!foundedUser) {
        throw new BadRequestError('Không tìm thấy người dùng');
    }
    const isMatchedPassword = await bcrypt.compare(req.body.oldPassword, foundedUser?.password);
    if (!isMatchedPassword) {
        throw new BadRequestFormError('Lỗi xảy ra', { field: 'oldPassword', message: 'Mật khẩu không chính xác' });
    }
    const saltRounds = 10;
    const newHashPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    await User.findByIdAndUpdate(req.userId, { password: newHashPassword }, { new: true });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: 'Đổi mật khẩu thành công',
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
