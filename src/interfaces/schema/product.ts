import { Schema, Document } from 'mongoose';

export interface IProductSchema extends Document {
    name: string;
    productCode: string;
    description: string;
    thumbnail: string;
    images: string[];
    price: number;
    stock: number;
    categoryId: Schema.Types.ObjectId;
    author: string;
    publicDate: string;
    tagId: Schema.Types.ObjectId;
    isHide: boolean;
}
