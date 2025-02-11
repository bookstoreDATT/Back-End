import mongoose, { Schema } from 'mongoose';

export const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        author: {
            type: String,
            required: true,
        },
        publicDate: {
            type: String,
            required: true,
        },
        tag: {
            type: [Schema.Types.ObjectId],
            ref: 'Tag',
        },
        images: [
            {
                type: String,
            },
        ],
        thumbnail: {
            type: String,
        },
    },
    { timestamps: true, versionKey: false },
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
