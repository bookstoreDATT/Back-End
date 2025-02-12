import { IProductSchema } from '@/interfaces/schema/product';
import mongoose, { Schema } from 'mongoose';
import { boolean } from 'zod';

export const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sold: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            max: 100,
            min: 0,
            default: 0,
        },
        productCode: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        images: [
            {
                type: String,
            },
        ],
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        tagId: {
            type: [Schema.Types.ObjectId],
            ref: 'Tag',
            required: true,
        },
        stock: {
            type: Number,
            default: 1,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        publicDate: {
            type: String,
            required: true,
        },
        isHide: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false },
);

const Product = mongoose.model<IProductSchema>('Product', ProductSchema);

export default Product;
