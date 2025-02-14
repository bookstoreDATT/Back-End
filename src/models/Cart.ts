import { CartData } from '@/interfaces/schema/Cart';
import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                type: {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product',
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                    _id: false,
                },
                default: [],
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Cart = mongoose.model<CartData>('Cart', CartSchema);
export default Cart;
