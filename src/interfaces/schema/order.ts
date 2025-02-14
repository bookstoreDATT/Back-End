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
    receiverInfo: {
        name: string;
        email: string;
        phone: string;
    };
    paymentMethod: string;
    isPaid: boolean;
    canceledBy: string;
    description: string;
    orderStatus: string;
}
