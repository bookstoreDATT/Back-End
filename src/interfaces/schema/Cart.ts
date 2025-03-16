import { Types } from 'mongoose';

export type CartItem = {
    name: string;
    productId: Types.ObjectId;
    quantity: number;
};

export type CartData = {
    userId: Types.ObjectId;
    items: CartItem[];
};
