import { BadRequestError, BadRequestFormError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import Tag from '@/models/Tag';
import { uploadImages } from '@/utils/cloudinary/uploadImage';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

// POPULATE PRODUCT
const populateCategory = {
    path: 'categoryId',
    select: 'name',
    model: 'Category',
};
const populateTag = {
    path: 'tagId',
    select: 'name',
    model: 'Tag',
};
// @CREATE PRODUCT
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const checkNameProduct = await Product.findOne({ name: req.body.name });
    if (checkNameProduct) {
        throw new BadRequestFormError('Có lỗi xảy ra', { message: 'Tên sách này đã tồn tại', field: 'name' });
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploadedThumbnail = files.thumbnail ? await uploadImages(files.thumbnail[0]) : null;
    const thumbnailUrl = Array.isArray(uploadedThumbnail) ? uploadedThumbnail[0] : uploadedThumbnail || '';
    const imagesUrl = files.images ? await uploadImages(files.images) : [];
    const tagIdArray = Array.isArray(req.body.tagId)
        ? req.body.tagId.map((id: string) => new mongoose.Types.ObjectId(id.trim()))
        : typeof req.body.tagId === 'string'
          ? req.body.tagId.split(',').map((id: string) => new mongoose.Types.ObjectId(id.trim()))
          : [];
    const newProduct = await Product.create({
        ...req.body,
        thumbnail: thumbnailUrl || '',
        images: imagesUrl,
        tagId: tagIdArray,
    });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newProduct,
            status: StatusCodes.CREATED,
            success: true,
            message: 'Thêm mới sản phẩm thành công!',
        }),
    );
};
// UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const existingProduct = await Product.findOne({ _id: req.params.id });
    if (!existingProduct) {
        throw new BadRequestError('Sản phẩm không tồn tại');
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploadedThumbnail = files.thumbnail ? await uploadImages(files.thumbnail[0]) : null;
    const thumbnailUrl = Array.isArray(uploadedThumbnail) ? uploadedThumbnail[0] : uploadedThumbnail;
    const uploadedImages = files.images ? await uploadImages(files.images) : null;
    const imagesUrl = uploadedImages;
    const tagIdArray = Array.isArray(req.body.tagId)
        ? req.body.tagId.map((id: string) => new mongoose.Types.ObjectId(id.trim()))
        : typeof req.body.tagId === 'string'
          ? req.body.tagId.split(',').map((id: string) => new mongoose.Types.ObjectId(id.trim()))
          : existingProduct.tagId;
    req.body.tagId = tagIdArray;
    req.body.thumbnail = thumbnailUrl;
    req.body.images = imagesUrl;
    existingProduct.set({ ...req.body });
    await existingProduct.save();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: existingProduct,
            status: StatusCodes.OK,
            success: true,
            message: 'Cập nhật sản phẩm thành công!',
        }),
    );
};
// @ GET ALL PRODUCT
export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);

    let tagIds: string[] = [];

    if (req.query.search) {
        const searchTerms = req.query.search
            .toString()
            .toLowerCase()
            .split(/[,\s]+/) // Tách bằng dấu phẩy hoặc khoảng trắng
            .filter((term) => term.trim() !== ''); // Loại bỏ khoảng trắng dư thừa
        console.log(searchTerms);
        if (searchTerms.length > 0) {
            const matchingTags = await Tag.find({
                name: { $in: searchTerms.map((term) => new RegExp(term, 'i')) }, // Tìm theo bất kỳ từ khóa nào
            }).select('_id');

            tagIds = matchingTags.map((tag) => tag._id.toString()); // Chuyển về mảng string
        }
    }

    console.log(tagIds);
    req.query.tagIds = tagIds.join(',');

    const features = new APIQuery(Product.find().populate(populateCategory).populate(populateTag), req.query);
    features.filter().sort().limitFields().search().paginate(); // ✅ Không cần async

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                data,
                page,
                totalDocs,
                totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @ HIDE PRODUCT
export const hideProduct = async (req: Request, res: Response, next: NextFunction) => {
    const foundedProduct = await Product.findOne({ _id: req.params.id });
    if (!foundedProduct) {
        throw new BadRequestError('Không tìm thấy sản phẩm');
    }
    foundedProduct.isHide = !foundedProduct.isHide;
    foundedProduct.save();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: foundedProduct,
            message: 'Ẩn sản phẩm thành công',
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
// @ GET DETAIL PRODUCT
export const getDetailedProduct = async (req: Request, res: Response, next: NextFunction) => {
    const foundedProduct = await Product.findOne({ _id: req.params.id });
    if (!foundedProduct) {
        throw new BadRequestError(`Not found product with id: ${req.params.id}`);
    }
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: foundedProduct,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
