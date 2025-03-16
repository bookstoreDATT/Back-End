import { IReviewsSchema } from '@/interfaces/schema/review';
import mongoose from 'mongoose';

const ReviewsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        content: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
export default mongoose.model<IReviewsSchema>('Review', ReviewsSchema);
