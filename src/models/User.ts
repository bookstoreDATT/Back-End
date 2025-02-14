import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLE } from '@/constants/allowedRoles';
import { IUserSchema } from '@/interfaces/schema/user';

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        avatar: {
            type: String,
            default:
                'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        },
        role: {
            type: String,
            default: ROLE.USER,
            enum: [ROLE.USER, ROLE.ADMIN],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        await mongoose.model('Cart').create({ userId: this._id });
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model<IUserSchema>('User', UserSchema);

export default User;
