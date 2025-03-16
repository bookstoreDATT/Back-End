import mongoose from 'mongoose';

export interface ItemOrder {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    isReviewed: boolean;
    isReviewDisabled: boolean;
}

export interface OrderSchema extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    items: ItemOrder[];
    totalPrice: number;
    shippingMethod: string;
    customerInfo: {
        name: string;
        email: string;
        phone: string;
    };
    paymentMethod: string;
    orderPaymentStatus: string;
    isPaid: boolean;
    canceledBy: string;
    description: string;
    orderStatus: string;
    orderCode: number;
    paymentLinkId: string;
}

export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
}

interface OrderItems {
    productId: string;
    quantity: number;
    image: string;
    price: number;
    name: string;
}

export interface IOrderCreatePayload {
    items: OrderItems[];
    customerInfo: CustomerInfo;
    shippingAddress: string;
    totalPrice: number;
    description?: string;
    paymentMethod: string;
}
