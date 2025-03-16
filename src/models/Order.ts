import { ORDER_PAYMENT_STATUS, ORDER_STATUS, PAYMENT_METHOD } from '@/constants/order';
import { OrderSchema } from '@/interfaces/schema/order';
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        isReviewed: {
            type: Boolean,
            default: false,
        },
        isReviewDisabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
        id: false,
        versionKey: false,
        timestamps: false,
    },
);

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        items: [OrderItemSchema],
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            trim: true,
            required: true,
            enum: [PAYMENT_METHOD.CASH, PAYMENT_METHOD.CARD],
            default: PAYMENT_METHOD.CASH,
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        customerInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        canceledBy: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        description: {
            type: String,
        },
        orderCode: {
            type: Number,
        },
        orderPaymentStatus: {
            type: String,
            trim: true,
            default: ORDER_PAYMENT_STATUS.PENDING,
            enum: [ORDER_PAYMENT_STATUS.PENDING, ORDER_PAYMENT_STATUS.CANCELLED, ORDER_PAYMENT_STATUS.SUCCESSED],
        },
        orderStatus: {
            type: String,
            trim: true,
            default: ORDER_STATUS.PENDING,
            enum: [
                ORDER_STATUS.PENDING,
                ORDER_STATUS.CANCELLED,
                ORDER_STATUS.CONFIRMED,
                ORDER_STATUS.SHIPPING,
                ORDER_STATUS.DELIVERED,
                ORDER_STATUS.DONE,
            ],
        },
        shippingFee: {
            type: Number,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const Order = mongoose.model<OrderSchema>('Order', OrderSchema);
export default Order;
