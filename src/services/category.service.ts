import { BadRequestError, BadRequestFormError } from '@/error/customError';
import handleQuery from '@/helpers/handleQuery';
import customResponse from '@/helpers/response';
import Category from '@/models/Category';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @ CREATE CATEGORY
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const foundedCategory = await Category.findOne({ name: req.body.name });
    if (foundedCategory) {
        throw new BadRequestFormError('Có lỗi xảy ra', { message: 'Danh mục này đã tồn tại!', field: 'category' });
    }
    const newCategory = await Category.create({ ...req.body });
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newCategory,
            status: StatusCodes.CREATED,
            success: true,
            message: 'Tạo danh mục thành công',
        }),
    );
};
// @GET DETAIL CATEGORY
export const getDetailedCategory = async (req: Request, res: Response, next: NextFunction) => {
    const newCategory = await Category.findById(req.params.id).lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newCategory,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
            success: true,
        }),
    );
};
// @UPDATE CATEGORY
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categoryIsExists = await Category.findOne({ name: req.body.name });
    if (categoryIsExists) {
        throw new BadRequestFormError('Có lỗi xảy ra', { message: 'Tên danh mục này đã tồn tại!', field: 'name' });
    }
    const foundedCategory = await Category.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).lean();
    if (!foundedCategory) {
        throw new BadRequestError('Không tìm thấy danh mục!');
    }
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: foundedCategory,
            status: StatusCodes.CREATED,
            success: true,
            message: 'Cập nhật danh mục thành công',
        }),
    );
};
// @ GET ALL CATEGORY
export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    const category = await handleQuery(req, Category);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: category,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
