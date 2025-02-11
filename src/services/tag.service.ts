import { BadRequestError, BadRequestFormError } from '@/error/customError';
import handleQuery from '@/helpers/handleQuery';
import customResponse from '@/helpers/response';
import Tag from '@/models/Tag';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @ CREATE TAG
export const createTag = async (req: Request, res: Response, next: NextFunction) => {
    const foundedCategory = await Tag.findOne({ name: req.body.name });
    if (foundedCategory) {
        throw new BadRequestFormError('Có lỗi xảy ra', { message: 'Danh mục này đã tồn tại!', field: 'category' });
    }
    const newCategory = await Tag.create({ ...req.body });
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newCategory,
            status: StatusCodes.CREATED,
            success: true,
            message: 'Tạo danh mục thành công',
        }),
    );
};
// @ DETAIL TAG
export const getDetailedTag = async (req: Request, res: Response, next: NextFunction) => {
    const newCategory = await Tag.findById(req.params.id).lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newCategory,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
            success: true,
        }),
    );
};
// @UPDATE TAG
export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
    const tagIsExists = await Tag.findOne({ name: req.body.name });
    if (tagIsExists) {
        throw new BadRequestFormError('Có lỗi xảy ra', { message: 'Tên thể loại này đã tồn tại!', field: 'name' });
    }
    const foundedtag = await Tag.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).lean();
    if (!foundedtag) {
        throw new BadRequestError('Không tìm thấy thể loại này!');
    }
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: foundedtag,
            status: StatusCodes.CREATED,
            success: true,
            message: 'Cập nhật danh mục thành công',
        }),
    );
};
// @ GET ALL TAG
export const getAllTag = async (req: Request, res: Response, next: NextFunction) => {
    const category = await handleQuery(req, Tag);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: category,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
